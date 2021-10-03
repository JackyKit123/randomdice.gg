import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { People, Credit } from 'types/database';
import Dashboard, {
  Image,
  SubmitButton,
  TextInput,
} from 'components/Dashboard';
import { fetchCredit } from 'misc/firebase';
import updateImage, { deleteImage } from 'misc/firebase/updateImage';
import InvalidWarning from 'components/InvalidWarning';

export default function editCredit(): JSX.Element {
  const dispatch = useDispatch();
  const database = firebase.database();
  const dbRef = database.ref('/credit');
  const [initialCredit, setInitialCredit] = useState<Credit>([]);
  const [credit, setCredit] = useState<Credit>([]);

  useEffect(() => {
    dbRef.once('value').then(snapshot => {
      setInitialCredit(snapshot.val());
      setCredit(snapshot.val());
    });
  }, []);

  const edited = (categoryId: number, personId: number): People | undefined =>
    initialCredit
      .find(category => category.id === categoryId)
      ?.people.find(person => person.id === personId);

  const creditChanged = !credit.every(
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

  const addPerson = (categoryId: number): void => {
    const category = credit.find(crd => crd.id === categoryId);
    if (category) {
      category.people.sort((a, b) => (a.id < b.id ? -1 : 1));
      let newId = category.people.findIndex((person, i) => person.id !== i);
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
    await Promise.all(
      initialCredit.map(category =>
        Promise.all(
          category.people.map(async person => {
            if (
              credit
                .find(categoryUpdated => categoryUpdated.id === category.id)
                ?.people.find(
                  personUpdated => personUpdated.id === person.id
                ) === undefined
            )
              await deleteImage('People Images', person.name);
          })
        )
      )
    );
    await Promise.all(
      credit.map(async category =>
        Promise.all(
          category.people.map(async person => {
            const personEdited = edited(category.id, person.id);
            // eslint-disable-next-line no-param-reassign
            person.img = await updateImage(
              person.img,
              'People Images',
              person.name,
              personEdited?.name
            );
          })
        )
      )
    );
    await Promise.all([
      database.ref('/last_updated/credit').set(new Date().toISOString()),
      database.ref('/credit').set(credit),
    ]);
    setInitialCredit(credit);
    fetchCredit(dispatch);
  };

  return (
    <Dashboard
      className='credit'
      isDataReady={!!(credit.length && initialCredit.length)}
    >
      <h3>Update Credit</h3>
      {credit.map(category => (
        <Fragment key={category.id}>
          <h4>{category.category}</h4>
          {category.people.map(person => (
            <form key={person.id}>
              <TextInput
                name='Name'
                isInvalid={invalidInput(category.id, person.id, 'name')}
                invalidWarningText='Name should not be empty.'
                value={person.name}
                setValue={(value): void => {
                  // eslint-disable-next-line no-param-reassign
                  person.name = value;
                  setCredit([...credit]);
                }}
              />
              <TextInput
                name='Role'
                isInvalid={invalidInput(category.id, person.id, 'role')}
                invalidWarningText='Name should not be empty.'
                value={person.role}
                setValue={(value): void => {
                  // eslint-disable-next-line no-param-reassign
                  person.role = value;
                  setCredit([...credit]);
                }}
              />
              <Image
                src={person.img}
                alt={person.name}
                isInvalid={invalidInput(category.id, person.id, 'img')}
                setSrc={(src): void => {
                  // eslint-disable-next-line no-param-reassign
                  person.img = src;
                  setCredit([...credit]);
                }}
              />
              <SubmitButton
                submitPromptText='Are you sure you want to delete this person from credit?'
                onSubmit={(): void => deletePerson(category.id, person.id)}
                type='delete'
              />
            </form>
          ))}
          <button type='button' onClick={(): void => addPerson(category.id)}>
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
          <InvalidWarning
            isInvalid={creditChanged}
            invalidWarningText='You have unsaved changes.'
          />
        </Fragment>
      ))}
      <hr className='divisor' />
      <SubmitButton
        submitPromptText='Are you sure you want to update the credit?'
        onSubmit={handleSubmit}
        type='submit'
      />
    </Dashboard>
  );
}
