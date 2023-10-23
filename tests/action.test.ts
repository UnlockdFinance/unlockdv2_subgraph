import {
    assert,
    describe,
    test,
    clearStore,
    afterEach, newMockEvent,
} from "matchstick-as";
import {Address, BigInt, Bytes, ethereum} from "@graphprotocol/graph-ts";
import {createAssignEvent} from "./cryptopunks-utils";
import {Assign} from "../generated/CryptoPunks/CryptoPunks";
import {handleBorrow} from "../src/mappings/action";
import {Borrow} from "../generated/action/Action";
import {Borrow as BorrowSchema} from "../generated/schema";


describe("Describe entity assertions", () => {

    afterEach(() => {
        clearStore();
    });
    test("Assign created and stored single asset", () => {
        let to = Address.fromString("0x07fd350bb866d1768b4eeb87b452f1669038fbd0");
        let assignEvent = changetype<Borrow>(newMockEvent())

        assignEvent.parameters = new Array()
        assignEvent.transaction.hash = Bytes.fromHexString("0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654")
        assignEvent.transaction.input = Bytes.fromHexString("0xc94b31a6000000000000000000000000163be70e6e126f70af1e7d1ebc531f70b2c85a3b00000000000000000000000000000000000000000000000000005af3107a400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000001baded87ccf06df895fda120f156693ce828698621936e38bd241c5a2a92114c112a5e86358436be22cba6b7b6d3fa4008467453a429a88b79c92e0a2600b7699b0000000000000000000000000000000000000000000000000000018af0d5faa000000000000000000000000000000000000000000000000000000000000000010000000000000000000000004ac593920d734be24250cb0bfac39df621c6e636000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000018af0d5faa0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000018af0d5faa00000000000000000000000000000000000000000000000000000000000000001c8aeed98eb0f411f05a522057ba08ff405ca08bdc24b9de755cddfa5e460be1f")

        assignEvent.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(to)))
        assignEvent.parameters.push(new ethereum.EventParam("loanId", ethereum.Value.fromBytes(Bytes.fromHexString("0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f"))))
        assignEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("100000000000000"))))
        assignEvent.parameters.push(new ethereum.EventParam("totalAssets", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1))))
        assignEvent.parameters.push(new ethereum.EventParam("token", ethereum.Value.fromAddress(Address.fromString("0x163be70e6e126f70af1e7d1ebc531f70b2c85a3b"))))

        handleBorrow(assignEvent);

        assert.entityCount("Borrow", 1);
        assert.entityCount("Asset", 1);

        // 0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654 is the transaction hash
        assert.fieldEquals(
            "Borrow",
            "0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654",
            "user",
            "0x07fd350bb866d1768b4eeb87b452f1669038fbd0"
        );
        assert.fieldEquals(
            "Borrow",
            "0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654",
            "uToken",
            "0x163be70e6e126f70af1e7d1ebc531f70b2c85a3b"
        );

        const borrow = BorrowSchema.load('0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654')
        const assets = borrow!.assets.load()
        assert.equals(
            ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(assets.length)),
            ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)))


        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-32",
            "collection",
            "0x4ac593920d734be24250cb0bfac39df621c6e636"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-32",
            "tokenId",
            "32"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-32",
            "borrow",
            "0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654"
        );
    })
    test("Assign created and stored multiple asset", () => {
        let to = Address.fromString("0x07fd350bb866d1768b4eeb87b452f1669038fbd0");
        let assignEvent = changetype<Borrow>(newMockEvent())

        assignEvent.parameters = new Array()
        assignEvent.transaction.hash = Bytes.fromHexString("0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654")
        assignEvent.transaction.input = Bytes.fromHexString("0xc94b31a6000000000000000000000000163be70e6e126f70af1e7d1ebc531f70b2c85a3b00000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000001bd0a278112a08b922ec87cc656064f7606f37db049de3bda9b4fb8b1ce9f2bd8b4b662d084c0b909f95c1023818b7422556d081bffa77e90ea7b4b4f991be14150000000000000000000000000000000000000000000000000000018434252e5100000000000000000000000000000000000000000000000000000000000000020000000000000000000000004ac593920d734be24250cb0bfac39df621c6e63600000000000000000000000000000000000000000000000000000000000000330000000000000000000000004ac593920d734be24250cb0bfac39df621c6e6360000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad78ebc5ac62000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018434252e51000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018434252e510000000000000000000000000000000000000000000000000000000000000002fcb5a36a4bdfff4713b4bc5f294cbad23e4f2c92c07e9eeec58b94e0effaa160c0796bbc61197497c781be988d903ef65c754e50e79fda34f9d875e7d970d7ba")

        assignEvent.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(to)))
        assignEvent.parameters.push(new ethereum.EventParam("loanId", ethereum.Value.fromBytes(Bytes.fromHexString("0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f"))))
        assignEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("100000000000000"))))
        assignEvent.parameters.push(new ethereum.EventParam("totalAssets", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1))))
        assignEvent.parameters.push(new ethereum.EventParam("token", ethereum.Value.fromAddress(Address.fromString("0x163be70e6e126f70af1e7d1ebc531f70b2c85a3b"))))

        handleBorrow(assignEvent);

        assert.entityCount("Borrow", 1);
        assert.entityCount("Asset", 2);

        // 0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654 is the transaction hash
        assert.fieldEquals(
            "Borrow",
            "0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654",
            "user",
            "0x07fd350bb866d1768b4eeb87b452f1669038fbd0"
        );
        assert.fieldEquals(
            "Borrow",
            "0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654",
            "uToken",
            "0x163be70e6e126f70af1e7d1ebc531f70b2c85a3b"
        );

        const borrow = BorrowSchema.load('0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654')
        const assets = borrow!.assets.load()
        assert.equals(
            ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(assets.length)),
            ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(2)))

        //Nft 1
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-51",
            "collection",
            "0x4ac593920d734be24250cb0bfac39df621c6e636"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-51",
            "tokenId",
            "51"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-51",
            "borrow",
            "0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654"
        );
        //Nft 2
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-52",
            "collection",
            "0x4ac593920d734be24250cb0bfac39df621c6e636"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-52",
            "tokenId",
            "52"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-52",
            "borrow",
            "0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654"
        );

    })
})
