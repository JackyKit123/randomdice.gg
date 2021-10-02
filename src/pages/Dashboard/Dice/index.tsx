import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import Dashboard, {
  Dropdown,
  Image,
  NumberInput,
  SubmitButton,
  TextInput,
} from 'components/Dashboard';
import LoadingScreen from 'components/Loading';
import { Die, DiceList } from 'types/database';
import { fetchDices } from 'misc/firebase';
import updateImage, { deleteImage } from 'misc/firebase/updateImage';

export default function editDice(): JSX.Element {
  const dispatch = useDispatch();
  const selectRef = useRef(null as null | HTMLSelectElement);
  const database = firebase.database();
  const dbRef = database.ref('/dice');
  const [diceList, setDiceList] = useState<DiceList>([]);
  const [dieId, setDieId] = useState<Die['id']>();
  const [dieName, setDieName] = useState<Die['name']>('');
  const [dieType, setDieType] = useState<Die['type']>('Physical');
  const [dieDescription, setDieDescription] = useState<Die['desc']>('');
  const [dieDetail, setDieDetail] = useState<Die['detail']>('');
  const [dieImgSrc, setDieImgSrc] = useState<Die['img']>('');
  const [dieTarget, setDieTarget] = useState<Die['target']>('-');
  const [dieRarity, setDieRarity] = useState<Die['rarity']>('Common');
  const [dieAtk, setDieAtk] = useState<Die['atk']>(0);
  const [dieSpd, setDieSpd] = useState<Die['spd']>(0);
  const [dieEff1, setDieEff1] = useState<Die['eff1']>(0);
  const [dieEff2, setDieEff2] = useState<Die['eff2']>(0);
  const [dieNameEff1, setDieNameEff1] = useState<Die['nameEff1']>('-');
  const [dieNameEff2, setDieNameEff2] = useState<Die['nameEff2']>('-');
  const [dieUnitEff1, setDieUnitEff1] = useState<Die['unitEff1']>('-');
  const [dieUnitEff2, setDieUnitEff2] = useState<Die['unitEff2']>('-');
  const [dieCupAtk, setDieCupAtk] = useState<Die['cupAtk']>(0);
  const [dieCupSpd, setDieCupSpd] = useState<Die['cupSpd']>(0);
  const [dieCupEff1, setDieCupEff1] = useState<Die['cupEff1']>(0);
  const [dieCupEff2, setDieCupEff2] = useState<Die['cupEff2']>(0);
  const [diePupAtk, setDiePupAtk] = useState<Die['pupAtk']>(0);
  const [diePupSpd, setDiePupSpd] = useState<Die['pupSpd']>(0);
  const [diePupEff1, setDiePupEff1] = useState<Die['pupEff1']>(0);
  const [diePupEff2, setDiePupEff2] = useState<Die['pupEff2']>(0);
  const [arenaValueType, setArenaValueType] = useState<
    Die['arenaValue']['type']
  >('Main Dps');
  const [arenaValueAssist, setArenaValueAssist] = useState<
    Die['arenaValue']['assist']
  >(0);
  const [arenaValueDps, setArenaValueDps] = useState<Die['arenaValue']['dps']>(
    0
  );
  const [arenaValueSlow, setArenaValueSlow] = useState<
    Die['arenaValue']['slow']
  >(0);
  const [arenaValueValue, setArenaValueValue] = useState<
    Die['arenaValue']['value']
  >(0);

  useEffect(() => {
    dbRef.once('value').then(snapshot => setDiceList(snapshot.val()));
  }, []);

  useEffect(() => {
    const die = diceList.find(d => d.id === dieId);
    if (!die) return;
    setDieName(die.name);
    setDieType(die.type);
    setDieDescription(die.desc);
    setDieDetail(die.detail);
    setDieImgSrc(die.img);
    setDieTarget(die.target);
    setDieRarity(die.rarity);
    setDieAtk(die.atk);
    setDieSpd(die.spd);
    setDieEff1(die.eff1);
    setDieEff2(die.eff2);
    setDieNameEff1(die.nameEff1);
    setDieNameEff2(die.nameEff2);
    setDieUnitEff1(die.unitEff1);
    setDieUnitEff2(die.unitEff2);
    setDieCupAtk(die.cupAtk);
    setDieCupSpd(die.cupSpd);
    setDieCupEff1(die.cupEff1);
    setDieCupEff2(die.cupEff2);
    setDiePupAtk(die.pupAtk);
    setDiePupSpd(die.pupSpd);
    setDiePupEff1(die.pupEff1);
    setDiePupEff2(die.pupEff2);
    setArenaValueType(die.arenaValue.type);
    setArenaValueAssist(die.arenaValue.assist);
    setArenaValueDps(die.arenaValue.dps);
    setArenaValueSlow(die.arenaValue.slow);
    setArenaValueValue(die.arenaValue.value);
  }, [dieId]);

  if (!diceList.length) {
    return (
      <Dashboard>
        <LoadingScreen />
      </Dashboard>
    );
  }

  const invalidName = !!dieName && /\bdice\b/i.test(dieName);
  const invalidImg = !!dieImgSrc && dieImgSrc.length <= 0;
  const invalidDescription = !!dieDescription && dieDescription.length <= 0;
  const invalidArenaDps =
    !!arenaValueDps && (arenaValueDps < 0 || arenaValueDps > 10);
  const invalidArenaSlow =
    !!arenaValueSlow && (arenaValueSlow < 0 || arenaValueSlow > 10);
  const invalidArenaAssist =
    !!arenaValueAssist && (arenaValueAssist < 0 || arenaValueAssist > 10);
  const invalidArenaValue =
    !!arenaValueValue && (arenaValueValue < 0 || arenaValueValue > 10);
  const invalidInput =
    invalidImg ||
    invalidName ||
    invalidDescription ||
    invalidArenaDps ||
    invalidArenaSlow ||
    invalidArenaAssist ||
    invalidArenaValue;

  const update = async (newDiceList: DiceList): Promise<void> => {
    database.ref('/last_updated/dice').set(new Date().toISOString());
    dbRef.set(newDiceList);
    fetchDices(dispatch);
    setDiceList(newDiceList);
    setDieId(undefined);
    if (selectRef.current) {
      selectRef.current.value = '?';
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!dieId) return;
    const die: Die = {
      id: dieId,
      name: dieName,
      type: dieType,
      desc: dieDescription,
      detail: dieDetail,
      img: dieImgSrc,
      target: dieTarget,
      rarity: dieRarity,
      atk: dieAtk,
      spd: dieSpd,
      eff1: dieEff1,
      eff2: dieEff2,
      nameEff1: dieNameEff1,
      nameEff2: dieNameEff2,
      unitEff1: dieUnitEff1,
      unitEff2: dieUnitEff2,
      cupAtk: dieCupAtk,
      cupSpd: dieCupSpd,
      cupEff1: dieCupEff1,
      cupEff2: dieCupEff2,
      pupAtk: diePupAtk,
      pupSpd: diePupSpd,
      pupEff1: diePupEff1,
      pupEff2: diePupEff2,
      arenaValue: {
        type: arenaValueType,
        dps: arenaValueDps,
        slow: arenaValueSlow,
        assist: arenaValueAssist,
        value: arenaValueValue,
      },
    };

    const oldDie = diceList.find(d => d.id === die?.id);
    die.img = await updateImage(
      dieImgSrc,
      'Dice Images',
      dieName,
      oldDie?.name
    );

    const result = [
      ...(diceList.some(d => d.id === die.id) ? [die] : []),
      ...diceList,
    ].sort((a, b) => {
      const rarityVal = {
        Common: 0,
        Rare: 1,
        Unique: 2,
        Legendary: 3,
      };
      if (rarityVal[a.rarity] < rarityVal[b.rarity]) {
        return -1;
      }
      if (rarityVal[a.rarity] > rarityVal[b.rarity]) {
        return 1;
      }
      return 0;
    });
    await update(result);
  };

  const handleDelete = async (): Promise<void> => {
    const oldDie = diceList.find(dice => dice.id === dieId);
    if (oldDie) {
      await deleteImage('Dice Images', oldDie.name);
      const result = diceList.filter(dice => dice.id !== dieId);
      await update(result);
    }
  };

  return (
    <Dashboard className='dice'>
      <label htmlFor='select-dice'>
        Select A Dice:
        <select
          ref={selectRef}
          name='select-dice'
          onChange={(evt): void => {
            if (evt.target.value === '?') {
              setDieId(undefined);
            } else {
              const foundDice = diceList.find(
                dice => dice.id === Number(evt.target.value)
              );
              if (foundDice) {
                setDieId(foundDice.id);
              } else {
                diceList.sort((a, b) => (a.id < b.id ? -1 : 1));
                let newId = diceList.findIndex((dice, i) => dice.id !== i);
                if (newId === -1) {
                  newId = diceList.length;
                }
                setDieId(newId);
              }
            }
          }}
        >
          <option>?</option>
          {diceList.map(dice => (
            <option key={dice.id} value={dice.id} id={dice.id.toString()}>
              {dice.name}
            </option>
          ))}
          <option>Add a New Dice</option>
        </select>
      </label>
      <hr className='divisor' />
      {typeof dieId !== 'undefined' && (
        <>
          <form onSubmit={(evt): void => evt.preventDefault()}>
            <h3>Dice Stat</h3>
            <Image
              src={dieImgSrc}
              setSrc={setDieImgSrc}
              alt='dice'
              isInvalid={invalidImg}
              extraImageProps={{ 'data-dice-rarity': dieRarity }}
            />
            <TextInput
              name='Name'
              isInvalid={invalidName}
              invalidWarningText="Do not include the word 'dice' in the name"
              value={dieName}
              setValue={setDieName}
            />
            <Dropdown
              name='Type'
              value={dieType}
              setValue={setDieType}
              options={['Physical', 'Magic', 'Buff', 'Merge', 'Transform']}
            />
            <TextInput
              name='Description'
              isInvalid={invalidDescription}
              invalidWarningText='Dice Description should be not empty.'
              value={dieDescription}
              setValue={setDieDescription}
            />
            <Dropdown
              name='Target'
              value={dieTarget}
              setValue={setDieTarget}
              options={['-', 'Front', 'Strongest', 'Random', 'Weakest']}
            />
            <Dropdown
              name='Rarity'
              value={dieRarity}
              setValue={setDieRarity}
              options={['Common', 'Rare', 'Unique', 'Legendary']}
            />
            <NumberInput
              name='Base Attack'
              value={dieAtk}
              setValue={setDieAtk}
            />
            <NumberInput
              name='Class Up Attack'
              value={dieCupAtk}
              setValue={setDieCupAtk}
            />
            <NumberInput
              name='Level Up Attack'
              value={diePupAtk}
              setValue={setDiePupAtk}
            />
            <NumberInput
              name='Base Attack Speed'
              value={dieSpd}
              setValue={setDieSpd}
            />
            <NumberInput
              name='Class Up Attack Speed'
              value={dieCupSpd}
              setValue={setDieCupSpd}
            />
            <NumberInput
              name='Level Up Attack Speed'
              value={diePupSpd}
              setValue={setDiePupSpd}
            />
            <TextInput
              name='Effect 1 Name'
              value={dieNameEff1}
              setValue={setDieNameEff1}
            />
            <TextInput
              name='Effect 1 Unit'
              value={dieUnitEff1}
              setValue={setDieUnitEff1}
            />
            <NumberInput
              name='Base Effect 1 Value'
              value={dieEff1}
              setValue={setDieEff1}
            />
            <NumberInput
              name='Class Up Effect 1 Value'
              value={dieCupEff1}
              setValue={setDieCupEff1}
            />
            <NumberInput
              name='Level Up Effect 1 Value'
              value={diePupEff1}
              setValue={setDiePupEff1}
            />
            <TextInput
              name='Effect 2 Name'
              value={dieNameEff2}
              setValue={setDieNameEff2}
            />
            <TextInput
              name='Effect 2 Unit'
              value={dieUnitEff2}
              setValue={setDieUnitEff2}
            />
            <NumberInput
              name='Base Effect 2 Value'
              value={dieEff2}
              setValue={setDieEff2}
            />
            <NumberInput
              name='Class Up Effect 2 Value'
              value={dieCupEff2}
              setValue={setDieCupEff2}
            />
            <NumberInput
              name='Level Up Effect 2 Value'
              value={diePupEff2}
              setValue={setDiePupEff2}
            />
            <hr className='divisor' />
            <h3>Arena</h3>
            <Dropdown
              name='Value Type'
              value={arenaValueType}
              setValue={setArenaValueType}
              options={['Main Dps', 'Assist Dps', 'Slow', 'Value']}
            />
            <NumberInput
              name='DPS Value'
              isInvalid={invalidArenaDps}
              invalidWarningText='Value must be between 0-10.'
              value={arenaValueDps}
              setValue={setArenaValueDps}
              min={0}
              max={10}
              step={1}
            />
            <NumberInput
              name='Slow Value'
              isInvalid={invalidArenaSlow}
              invalidWarningText='Value must be between 0-10.'
              value={arenaValueSlow}
              setValue={setArenaValueSlow}
              min={0}
              max={10}
              step={1}
            />
            <NumberInput
              name='Assist Value'
              isInvalid={invalidArenaAssist}
              invalidWarningText='Value must be between 0-10.'
              value={arenaValueAssist}
              setValue={setArenaValueAssist}
              min={0}
              max={10}
              step={1}
            />
            <NumberInput
              name='Value / Buff Value'
              isInvalid={invalidArenaValue}
              invalidWarningText='Value must be between 0-10.'
              value={arenaValueValue}
              setValue={setArenaValueValue}
              min={0}
              max={10}
              step={1}
            />
            <hr className='divisor' />
            <h3>Detail Dice Mechanic</h3>
            <TextInput
              type='rich-text'
              value={dieDetail}
              setValue={setDieDetail}
            />
          </form>
          <hr className='divisor' />
          <SubmitButton
            submitPromptText='Are you sure to want to update the information for this dice?'
            onSubmit={handleSubmit}
            isInvalid={invalidInput}
            type='submit'
          />
          <SubmitButton
            submitPromptText='Are you sure to want to delete this dice, the action is irreversible, it may break the the deck list and other tools. Make sure you have deleted those related content before deleting the dice.'
            onSubmit={handleDelete}
            isInvalid={invalidInput}
            type='delete'
          />
        </>
      )}
    </Dashboard>
  );
}
