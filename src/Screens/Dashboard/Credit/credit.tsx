import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faPlusCircle,
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
    People,
    Credit,
} from '../../../Misc/Redux Storage/Fetch Firebase/Credit/types';
import Dashboard from '../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../Components/Loading/loading';
import PopUp from '../../../Components/PopUp Overlay/popup';
import {
    OPEN_POPUP,
    CLOSE_POPUP,
} from '../../../Misc/Redux Storage/PopUp Overlay/types';
import './credit.less';
import { fetchCredit } from '../../../Misc/Firebase/fetchData';

export default function editCredit(): JSX.Element {
    const dispatch = useDispatch();
    const database = firebase.database();
    const storage = firebase.storage();
    const dbRef = database.ref('/credit');
    const [initialCredit, setInitialCredit] = useState<Credit>();
    const [credit, setCredit] = useState<Credit>();

    useEffect(() => {
        dbRef.once('value').then(snapshot => {
            setInitialCredit(snapshot.val());
            setCredit(snapshot.val());
        });
    }, []);

    if (!credit || !initialCredit) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    const edited = (categoryId: number, personId: number): People | undefined =>
        initialCredit
            .find(category => category.id === categoryId)
            ?.people.find(person => person.id === personId);

    const creditChanged = (): boolean => {
        return !credit.every(
            category =>
                category.people.every(person => {
                    const personEdited = edited(category.id, person.id);
                    if (!personEdited) {
                        return false;
                    }
                    return (
                        person.img === personEdited.img &&
                        person.name === personEdited.name &&
                        person.role === personEdited.role
                    );
                }) &&
                category.people.length ===
                    initialCredit.find(
                        initialCategory => category.id === initialCategory.id
                    )?.people.length
        );
    };

    const addPerson = (categoryId: number): void => {
        const category = credit.find(crd => crd.id === categoryId);
        if (category) {
            category.people.sort((a, b) => (a.id < b.id ? -1 : 1));
            let newId = category.people.findIndex(
                (person, i) => person.id !== i
            );
            if (newId === -1) {
                newId = category.people.length;
            }
            category.people.push({
                id: newId,
                name: '',
                img: '',
                role: '',
            });
            setCredit([...credit]);
        }
    };

    const deletePerson = (categoryId: number, personId: number): void => {
        const category = credit.find(crd => crd.id === categoryId);
        if (category) {
            category.people = category.people.filter(
                person => person.id !== personId
            );
            setCredit([...credit]);
        }
    };

    const invalidInput = (
        categoryId: number,
        personId: number,
        field: 'name' | 'img' | 'role'
    ): boolean => {
        const person = credit
            .find(crd => crd.id === categoryId)
            ?.people.find(p => p.id === personId);
        if (!person) {
            return false;
        }
        return person[field].length <= 0;
    };

    const handleSubmit = async (): Promise<void> => {
        initialCredit.forEach(category =>
            category.people.forEach(person => {
                if (
                    credit
                        .find(
                            categoryUpdated =>
                                categoryUpdated.id === category.id
                        )
                        ?.people.find(
                            personUpdated => personUpdated.id === person.id
                        ) === undefined
                ) {
                    storage.ref(`People Images/${person.name}`).delete();
                }
            })
        );
        await Promise.all(
            credit.map(async category => {
                await Promise.all(
                    category.people.map(async person => {
                        const personEdited = edited(category.id, person.id);
                        if (
                            /^data:image\/([a-zA-Z]*);base64,/.test(person.img)
                        ) {
                            if (personEdited) {
                                await storage
                                    .ref(`People Images/${personEdited.name}`)
                                    .delete();
                            }
                            await storage
                                .ref(`People Images/${person.name}`)
                                .putString(person.img, 'data_url', {
                                    cacheControl: 'public,max-age=31536000',
                                });
                            const newUrl = await storage
                                .ref(`People Images/${person.name}`)
                                .getDownloadURL();
                            // eslint-disable-next-line no-param-reassign
                            person.img = newUrl;
                        } else if (
                            personEdited &&
                            person.name !== personEdited.name
                        ) {
                            const img = (
                                await axios.get(person.img, {
                                    responseType: 'blob',
                                })
                            ).data;
                            await storage
                                .ref(`People Images/${personEdited.name}`)
                                .delete();
                            const reader = new FileReader();
                            reader.readAsDataURL(img);
                            reader.onloadend = async (): Promise<void> => {
                                const base64 = reader.result as string;
                                await storage
                                    .ref(`People Images/${person.name}`)
                                    .putString(base64, 'data_url', {
                                        cacheControl: 'public,max-age=31536000',
                                    });
                                const newUrl = await storage
                                    .ref(`People Images/${person.name}`)
                                    .getDownloadURL();
                                // eslint-disable-next-line no-param-reassign
                                person.img = newUrl;
                            };
                        }
                    })
                );
            })
        );
        database.ref('/last_updated/credit').set(new Date().toISOString());
        database.ref('/credit').set(credit);
        setInitialCredit(credit);
        fetchCredit(dispatch);
    };

    return (
        <Dashboard className='credit'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>Are you sure to want to update the credit?</p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        handleSubmit();
                        dispatch({ type: CLOSE_POPUP });
                    }}
                >
                    Yes
                </button>
            </PopUp>
            <h3>Update Credit</h3>
            {credit.map(category => (
                <Fragment key={category.id}>
                    <h4>{category.category}</h4>
                    {category.people.map(person => (
                        <form key={person.id}>
                            <label htmlFor='person-name'>
                                Name:
                                <input
                                    className={
                                        invalidInput(
                                            category.id,
                                            person.id,
                                            'name'
                                        )
                                            ? 'invalid'
                                            : ''
                                    }
                                    defaultValue={person.name}
                                    type='textbox'
                                    onChange={(evt): void => {
                                        // eslint-disable-next-line no-param-reassign
                                        person.name = evt.target.value;
                                        setCredit([...credit]);
                                    }}
                                />
                            </label>
                            {invalidInput(category.id, person.id, 'name') ? (
                                <span className='invalid-warning'>
                                    Name should not be empty.
                                </span>
                            ) : null}
                            <label htmlFor='person-role'>
                                Role:
                                <input
                                    className={
                                        invalidInput(
                                            category.id,
                                            person.id,
                                            'role'
                                        )
                                            ? 'invalid'
                                            : ''
                                    }
                                    defaultValue={person.role}
                                    type='textbox'
                                    onChange={(evt): void => {
                                        // eslint-disable-next-line no-param-reassign
                                        person.role = evt.target.value;
                                        setCredit([...credit]);
                                    }}
                                />
                            </label>
                            {invalidInput(category.id, person.id, 'role') ? (
                                <span className='invalid-warning'>
                                    Role should not be empty.
                                </span>
                            ) : null}
                            <label htmlFor='person-img'>
                                Image:
                                <figure>
                                    <img src={person.img} alt={person.name} />
                                </figure>
                                <input
                                    className={
                                        invalidInput(
                                            category.id,
                                            person.id,
                                            'img'
                                        )
                                            ? 'invalid'
                                            : ''
                                    }
                                    type='file'
                                    alt='boss'
                                    accept='image/*'
                                    onChange={(evt): void => {
                                        if (evt.target.files) {
                                            const reader = new FileReader();
                                            const file = evt.target.files[0];
                                            reader.readAsDataURL(file);
                                            reader.onloadend = (): void => {
                                                // eslint-disable-next-line no-param-reassign
                                                person.img = reader.result as string;
                                                setCredit([...credit]);
                                            };
                                        }
                                    }}
                                />
                            </label>
                            {invalidInput(category.id, person.id, 'img') ? (
                                <span className='invalid-warning'>
                                    Please upload a square image in png format.
                                </span>
                            ) : null}
                            <button
                                type='button'
                                onClick={(): void =>
                                    deletePerson(category.id, person.id)
                                }
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </form>
                    ))}
                    <button
                        type='button'
                        onClick={(): void => addPerson(category.id)}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </button>
                    {creditChanged() ? (
                        <span className='invalid-warning'>
                            You have unsaved changes.
                        </span>
                    ) : null}
                </Fragment>
            ))}
            <hr className='divisor' />
            <button
                type='button'
                className='submit'
                onClick={(): void => {
                    dispatch({
                        type: OPEN_POPUP,
                        payload: 'confirm-submit',
                    });
                }}
            >
                <FontAwesomeIcon icon={faCheck} />
            </button>
        </Dashboard>
    );
}
