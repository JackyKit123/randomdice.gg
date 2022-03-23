import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import Dashboard, {
  Dropdown,
  Image,
  NumberInput,
  Selector,
  SubmitButton,
  TextInput,
} from 'components/Dashboard';
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
  const [dieEff3, setDieEff3] = useState<Die['eff3']>(0);
  const [dieNameEff1, setDieNameEff1] = useState<Die['nameEff1']>('-');
  const [dieNameEff2, setDieNameEff2] = useState<Die['nameEff2']>('-');
  const [dieNameEff3, setDieNameEff3] = useState<Die['nameEff3']>('-');
  const [dieUnitEff1, setDieUnitEff1] = useState<Die['unitEff1']>('-');
  const [dieUnitEff2, setDieUnitEff2] = useState<Die['unitEff2']>('-');
  const [dieUnitEff3, setDieUnitEff3] = useState<Die['unitEff3']>('-');
  const [dieCupAtk, setDieCupAtk] = useState<Die['cupAtk']>(0);
  const [dieCupSpd, setDieCupSpd] = useState<Die['cupSpd']>(0);
  const [dieCupEff1, setDieCupEff1] = useState<Die['cupEff1']>(0);
  const [dieCupEff2, setDieCupEff2] = useState<Die['cupEff2']>(0);
  const [dieCupEff3, setDieCupEff3] = useState<Die['cupEff3']>(0);
  const [diePupAtk, setDiePupAtk] = useState<Die['pupAtk']>(0);
  const [diePupSpd, setDiePupSpd] = useState<Die['pupSpd']>(0);
  const [diePupEff1, setDiePupEff1] = useState<Die['pupEff1']>(0);
  const [diePupEff2, setDiePupEff2] = useState<Die['pupEff2']>(0);
  const [diePupEff3, setDiePupEff3] = useState<Die['pupEff3']>(0);
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
    setDieName(die?.name ?? '');
    setDieType(die?.type ?? 'Physical');
    setDieDescription(die?.desc ?? '');
    setDieDetail(die?.detail ?? '');
    setDieImgSrc(die?.img ?? '');
    setDieTarget(die?.target ?? '-');
    setDieRarity(die?.rarity ?? 'Common');
    setDieAtk(die?.atk ?? 0);
    setDieSpd(die?.spd ?? 0);
    setDieEff1(die?.eff1 ?? 0);
    setDieEff2(die?.eff2 ?? 0);
    setDieNameEff1(die?.nameEff1 ?? '');
    setDieNameEff2(die?.nameEff2 ?? '');
    setDieNameEff3(die?.nameEff3 ?? '');
    setDieUnitEff1(die?.unitEff1 ?? '');
    setDieUnitEff2(die?.unitEff2 ?? '');
    setDieUnitEff3(die?.unitEff3 ?? '');
    setDieCupAtk(die?.cupAtk ?? 0);
    setDieCupSpd(die?.cupSpd ?? 0);
    setDieCupEff1(die?.cupEff1 ?? 0);
    setDieCupEff2(die?.cupEff2 ?? 0);
    setDieCupEff3(die?.cupEff3 ?? 0);
    setDiePupAtk(die?.pupAtk ?? 0);
    setDiePupSpd(die?.pupSpd ?? 0);
    setDiePupEff1(die?.pupEff1 ?? 0);
    setDiePupEff2(die?.pupEff2 ?? 0);
    setDiePupEff3(die?.pupEff3 ?? 0);
    setArenaValueType(die?.arenaValue.type ?? 'Main Dps');
    setArenaValueAssist(die?.arenaValue.assist ?? 0);
    setArenaValueDps(die?.arenaValue.dps ?? 0);
    setArenaValueSlow(die?.arenaValue.slow ?? 0);
    setArenaValueValue(die?.arenaValue.value ?? 0);
  }, [dieId]);

  const invalidName = /\bdice\b/i.test(dieName);
  const invalidImg = dieImgSrc.length <= 0;
  const invalidDescription = dieDescription.length <= 0;
  const invalidArenaDps = arenaValueDps < 0 || arenaValueDps > 10;
  const invalidArenaSlow = arenaValueSlow < 0 || arenaValueSlow > 10;
  const invalidArenaAssist = arenaValueAssist < 0 || arenaValueAssist > 10;
  const invalidArenaValue = arenaValueValue < 0 || arenaValueValue > 10;
  const invalidInput =
    invalidImg ||
    invalidName ||
    invalidDescription ||
    invalidArenaDps ||
    invalidArenaSlow ||
    invalidArenaAssist ||
    invalidArenaValue;

  const update = async (newDiceList: DiceList): Promise<void> => {
    await Promise.all([
      database.ref('/last_updated/dice').set(new Date().toISOString()),
      dbRef.set(newDiceList),
    ]);
    fetchDices(dispatch);
    setDiceList(newDiceList);
    setDieId(undefined);
    if (selectRef.current) {
      selectRef.current.value = '?';
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (typeof dieId === 'undefined' || invalidInput) return;
    const oldDie = diceList.find(d => d.id === dieId);
    const die: Die = {
      id: dieId,
      name: dieName.trim(),
      type: dieType,
      desc: dieDescription.trim(),
      detail: dieDetail.trim(),
      img: await updateImage(dieImgSrc, 'Dice Images', dieName, oldDie?.name),
      target: dieTarget,
      rarity: dieRarity,
      atk: dieAtk,
      spd: dieSpd,
      eff1: dieEff1,
      eff2: dieEff2,
      eff3: dieEff3,
      nameEff1: dieNameEff1.trim(),
      nameEff2: dieNameEff2.trim(),
      nameEff3: dieNameEff3.trim(),
      unitEff1: dieUnitEff1.trim(),
      unitEff2: dieUnitEff2.trim(),
      unitEff3: dieUnitEff3.trim(),
      cupAtk: dieCupAtk,
      cupSpd: dieCupSpd,
      cupEff1: dieCupEff1,
      cupEff2: dieCupEff2,
      cupEff3: dieCupEff3,
      pupAtk: diePupAtk,
      pupSpd: diePupSpd,
      pupEff1: diePupEff1,
      pupEff2: diePupEff2,
      pupEff3: diePupEff3,
      arenaValue: {
        type: arenaValueType,
        dps: arenaValueDps,
        slow: arenaValueSlow,
        assist: arenaValueAssist,
        value: arenaValueValue,
      },
    };

    const result = diceList.map(d => (d.id === dieId ? die : d));
    if (!result.some(d => d.id === dieId)) {
      result.push(die);
    }

    result.sort((a, b) => {
      const rarityVal = {
        Common: 0,
        Rare: 1,
        Unique: 2,
        Legendary: 3,
      };
      return rarityVal[a.rarity] - rarityVal[b.rarity];
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
    <Dashboard className='dice' isDataReady={!!diceList.length}>
      <Selector
        name='Dice'
        selectRef={selectRef}
        data={diceList}
        setActive={setDieId}
      />
      <hr className='divisor' />
      {typeof dieId !== 'undefined' && (
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
            options={[
              'Physical',
              'Magic',
              'Buff',
              'Merge',
              'Transform',
              'Debuff',
              'Install',
            ]}
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
          <NumberInput name='Base Attack' value={dieAtk} setValue={setDieAtk} />
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
          <TextInput
            name='Effect 3 Name'
            value={dieNameEff3}
            setValue={setDieNameEff3}
          />
          <TextInput
            name='Effect 3 Unit'
            value={dieUnitEff3}
            setValue={setDieUnitEff3}
          />
          <NumberInput
            name='Base Effect 3 Value'
            value={dieEff3}
            setValue={setDieEff3}
          />
          <NumberInput
            name='Class Up Effect 3 Value'
            value={dieCupEff3}
            setValue={setDieCupEff3}
          />
          <NumberInput
            name='Level Up Effect 3 Value'
            value={diePupEff3}
            setValue={setDiePupEff3}
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
            toolbar='basic'
          />

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
        </form>
      )}
    </Dashboard>
  );
}
