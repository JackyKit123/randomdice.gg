function validate(key: string, data: unknown): boolean {
    switch (key) {
        case 'decks':
            return (
                Array.isArray(data) &&
                data.every(
                    datum =>
                        datum instanceof Object &&
                        datum.guide?.every(
                            (guide: unknown) => typeof guide === 'number'
                        ) &&
                        typeof datum.id === 'number' &&
                        /(?:pvp|co-op|crew|-)/i.test(datum.type) &&
                        typeof datum.rating?.default === 'number' &&
                        (typeof datum.rating?.c8 === 'undefined' ||
                            typeof datum.rating?.c8 === 'number') &&
                        (typeof datum.rating?.c9 === 'undefined' ||
                            typeof datum.rating?.c9 === 'number') &&
                        (typeof datum.rating?.c10 === 'undefined' ||
                            typeof datum.rating?.c10 === 'number') &&
                        typeof datum.battlefield === 'number' &&
                        datum.decks?.every(
                            (deck: unknown) =>
                                Array.isArray(deck) &&
                                deck.every(
                                    (die: unknown) => typeof die === 'number'
                                )
                        )
                )
            );
        case 'dice':
            return (
                Array.isArray(data) &&
                data.every(
                    datum =>
                        typeof datum === 'object' &&
                        typeof datum.id === 'number' &&
                        typeof datum.name === 'string' &&
                        /(?:Physical|Magic|Buff|Merge|Transform|Install)/i.test(
                            datum.type
                        ) &&
                        typeof datum.desc === 'string' &&
                        typeof datum.detail === 'string' &&
                        typeof datum.img === 'string' &&
                        /(?:Front|Strongest|Random|Weakest|-)/i.test(
                            datum.target
                        ) &&
                        /(?:Common|Rare|Unique|Legendary)/i.test(
                            datum.rarity
                        ) &&
                        typeof datum.atk === 'number' &&
                        typeof datum.spd === 'number' &&
                        typeof datum.eff1 === 'number' &&
                        typeof datum.eff2 === 'number' &&
                        typeof datum.nameEff1 === 'string' &&
                        typeof datum.nameEff2 === 'string' &&
                        typeof datum.unitEff1 === 'string' &&
                        typeof datum.unitEff2 === 'string' &&
                        typeof datum.cupAtk === 'number' &&
                        typeof datum.cupSpd === 'number' &&
                        typeof datum.cupEff1 === 'number' &&
                        typeof datum.cupEff2 === 'number' &&
                        typeof datum.pupAtk === 'number' &&
                        typeof datum.pupSpd === 'number' &&
                        typeof datum.pupEff1 === 'number' &&
                        typeof datum.pupEff2 === 'number' &&
                        (typeof datum.alternatives === 'undefined' ||
                            (typeof datum.alternatives?.desc === 'string' &&
                                Array.isArray(datum.alternatives?.list) &&
                                (datum.alternatives.list as unknown[]).every(
                                    item => typeof item === 'number'
                                ))) &&
                        /(?:Main Dps|Assist Dps|Slow|Value)/i.test(
                            datum.arenaValue?.type
                        ) &&
                        typeof datum.arenaValue?.assist === 'number' &&
                        typeof datum.arenaValue?.dps === 'number' &&
                        typeof datum.arenaValue?.slow === 'number' &&
                        typeof datum.arenaValue?.value === 'number'
                )
            );
        case 'wiki': {
            if (typeof data === 'object' && data !== null) {
                const { box, intro, boss, tips, battlefield } = data as {
                    box: unknown;
                    intro: unknown;
                    boss: unknown;
                    tips: unknown;
                    battlefield: unknown;
                };
                if (typeof intro !== 'object' || intro === null) {
                    return false;
                }
                interface IntroUnknown {
                    PvP: unknown;
                    'Co-op': unknown;
                    Crew: unknown;
                    Arena: unknown;
                    Store: unknown;
                }
                return (
                    Array.isArray(box) &&
                    box.every(
                        b =>
                            typeof b.id === 'number' &&
                            typeof b.name === 'string' &&
                            typeof b.img === 'string' &&
                            typeof b.from === 'string' &&
                            typeof b.contain === 'string'
                    ) &&
                    typeof (intro as IntroUnknown).PvP === 'string' &&
                    typeof (intro as IntroUnknown)['Co-op'] === 'string' &&
                    typeof (intro as IntroUnknown).Crew === 'string' &&
                    typeof (intro as IntroUnknown).Arena === 'string' &&
                    typeof (intro as IntroUnknown).Store === 'string' &&
                    Array.isArray(boss) &&
                    boss.every(
                        b =>
                            typeof b.id === 'number' &&
                            typeof b.name === 'string' &&
                            typeof b.img === 'string' &&
                            typeof b.desc === 'string'
                    ) &&
                    Array.isArray(tips) &&
                    tips.every(
                        tip =>
                            typeof tip.id === 'number' &&
                            typeof tip.content === 'string' &&
                            typeof tip.title === 'string' &&
                            /(?:Beginners|Intermediate|Advanced)/.test(
                                tip.level
                            )
                    ) &&
                    Array.isArray(battlefield) &&
                    battlefield.every(
                        b =>
                            typeof b.id === 'number' &&
                            typeof b.name === 'string' &&
                            typeof b.img === 'string' &&
                            typeof b.desc === 'string' &&
                            typeof b.source === 'string' &&
                            typeof b.buffName === 'string' &&
                            typeof b.buffValue === 'number' &&
                            typeof b.buffUnit === 'string' &&
                            typeof b.buffCupValue === 'number'
                    )
                );
            }
            return false;
        }
        case 'decks_guide':
            return (
                Array.isArray(data) &&
                data.every(
                    datum =>
                        typeof datum.id === 'number' &&
                        typeof datum.name === 'string' &&
                        datum.type?.matcH(/PvP|Co-op|Crew/i) &&
                        Array.isArray(datum.diceList) &&
                        (datum.diceList as unknown[]).every(
                            deck =>
                                Array.isArray(deck) &&
                                deck.every(die => typeof die === 'number')
                        ) &&
                        typeof datum.guide === 'string' &&
                        typeof datum.archived === 'boolean' &&
                        typeof datum.battlefield === 'number'
                )
            );
        case 'credit':
            return (
                Array.isArray(data) &&
                data.every(
                    datum =>
                        typeof datum.id === 'number' &&
                        typeof datum.category === 'string' &&
                        Array.isArray(datum.people) &&
                        (datum.people as {
                            id: unknown;
                            name: unknown;
                            img: unknown;
                            role: unknown;
                        }[]).every(
                            person =>
                                typeof person.id === 'number' &&
                                typeof person.name === 'string' &&
                                typeof person.img === 'string' &&
                                typeof person.role === 'string'
                        )
                )
            );
        case 'critData':
            return (
                typeof data === 'object' &&
                data !== null &&
                Object.values(data).every(
                    val =>
                        typeof val.trophies === 'number' &&
                        typeof val.crit === 'number'
                )
            );
        case 'patreon_list':
            return (
                Array.isArray(data) &&
                data.every(datum => {
                    if (
                        typeof datum.id === 'string' &&
                        typeof datum.name === 'string' &&
                        (typeof datum.img === 'undefined' ||
                            typeof datum.img === 'string') &&
                        typeof datum.tier === 'number'
                    ) {
                        const { id } = datum;
                        return (
                            (datum[id] !== null &&
                                typeof datum[id] === 'undefined') ||
                            ((typeof datum[id].message === 'string' ||
                                typeof datum[id].message === 'undefined') &&
                                (typeof datum[id].youtubeId === 'string' ||
                                    typeof datum[id].youtubeId === 'undefined'))
                        );
                    }
                    return false;
                })
            );
        case 'news': {
            if (typeof data === 'object' && data !== null) {
                const { game, website } = data as {
                    game: unknown;
                    website: unknown;
                };
                return typeof game === 'string' && typeof website === 'string';
            }
            return false;
        }
        case 'YoutubeChannels': {
            return (
                Array.isArray(data) &&
                data.every(
                    datum =>
                        typeof datum.id === 'string' &&
                        typeof datum.videoCount === 'number' &&
                        typeof datum.subscriberCount === 'number' &&
                        typeof datum.viewCount === 'number' &&
                        typeof datum.title === 'string' &&
                        typeof datum.description === 'string' &&
                        typeof datum.thumbnails === 'string'
                )
            );
        }
        default:
            if (key.match(/^users\/.+/)) {
                if (typeof data === 'object' && data !== null) {
                    interface UnknownData {
                        'linked-account': unknown;
                        'patreon-tier': unknown;
                        editor: unknown;
                    }

                    interface UnknownLinkedAccount {
                        discord?: unknown;
                        patreon?: unknown;
                    }

                    if (
                        (typeof (data as UnknownData)['linked-account'] ===
                            'object' &&
                            (typeof (data as UnknownData)['patreon-tier'] ===
                                'number' ||
                                typeof (data as UnknownData)['patreon-tier'] ===
                                    'undefined') &&
                            (data as UnknownData).editor === true) ||
                        typeof (data as UnknownData).editor === 'undefined'
                    ) {
                        const { discord, patreon } = (data as UnknownData)[
                            'linked-account'
                        ] as UnknownLinkedAccount;
                        return (
                            (typeof discord === 'undefined' ||
                                typeof discord === 'string') &&
                            (typeof patreon === 'undefined' ||
                                typeof patreon === 'string')
                        );
                    }

                    return false;
                }
            }
            return false;
    }
}

export default function validateLocalstorage(key: string): unknown {
    const localData = localStorage.getItem(key);
    if (localData) {
        try {
            const data = JSON.parse(localData) as unknown;
            if (validate(key, data)) {
                return data;
            }
            localStorage.removeItem(key);
            return null;
        } catch {
            // error at JSON.parse, prob corrupted JSON, removing item and proceed to fetch database
            localStorage.removeItem(key);
            return null;
        }
    }
    return null;
}
