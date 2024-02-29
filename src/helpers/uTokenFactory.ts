import {
    UTokenBorrow,
    Supply,
    UTokenRepay,
    Withdraw,
    FrozenVault,
    ActiveVault,
    PausedVault,
} from '../../generated/schema';

export function getOrCreateUTokenBorrow(
    id: String,
    createIfNotFound: boolean = true,
): UTokenBorrow {
    // @ts-ignore: assign wrapper object to primitive
    let borrowOnBelhalf = UTokenBorrow.load(id);

    if (borrowOnBelhalf == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        borrowOnBelhalf = new UTokenBorrow(id);
    }

    return borrowOnBelhalf as UTokenBorrow;
}

export function getOrCreateSupply(
    id: String,
    createIfNotFound: boolean = true,
): Supply {
    // @ts-ignore: assign wrapper object to primitive
    let deposit = Supply.load(id);

    if (deposit == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        deposit = new Supply(id);
    }

    return deposit as Supply;
}

export function getOrCreateUTokenRepay(
    id: String,
    createIfNotFound: boolean = true,
): UTokenRepay {
    // @ts-ignore: assign wrapper object to primitive
    let repayOnBelhalf = UTokenRepay.load(id);

    if (repayOnBelhalf == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        repayOnBelhalf = new UTokenRepay(id);
    }

    return repayOnBelhalf as UTokenRepay;
}

export function getOrCreateWithdraw(
    id: String,
    createIfNotFound: boolean = true,
): Withdraw {
    // @ts-ignore: assign wrapper object to primitive
    let withdraw = Withdraw.load(id);

    if (withdraw == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        withdraw = new Withdraw(id);
    }

    return withdraw as Withdraw;
}

export function getOrCreateFrozenVault(
    id: String,
    createIfNotFound: boolean = true,
): FrozenVault {
    // @ts-ignore: assign wrapper object to primitive
    let frozenVault = FrozenVault.load(id);

    if (frozenVault == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        frozenVault = new FrozenVault(id);
        frozenVault.isFrozen = false;
    }

    return frozenVault as FrozenVault;
}

export function getOrCreateActiveVault(
    id: String,
    createIfNotFound: boolean = true,
): ActiveVault {
    // @ts-ignore: assign wrapper object to primitive
    let activeVault = ActiveVault.load(id);

    if (activeVault == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        activeVault = new ActiveVault(id);
        activeVault.isActive = true;
    }

    return activeVault as ActiveVault;
}

export function getOrCreatePausedVault(
    id: String,
    createIfNotFound: boolean = true,
): PausedVault {
    // @ts-ignore: assign wrapper object to primitive
    let pausedVault = PausedVault.load(id);

    if (pausedVault == null && createIfNotFound) {
        // @ts-ignore: assign wrapper object to primitive
        pausedVault = new PausedVault(id);
        pausedVault.isPaused = false;
    }

    return pausedVault as PausedVault;
}

