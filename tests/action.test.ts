import {
    assert,
    describe,
    test,
    clearStore,
    afterEach, newMockEvent,
    createMockedFunction
} from "matchstick-as";
import {Address, BigInt, Bytes, ethereum} from "@graphprotocol/graph-ts";
import {handleBorrow, handleRepay} from "../src/mappings/action";
import {Borrow, Repay} from "../generated/action/Action";
import {Borrow as BorrowSchema} from "../generated/schema";

const buildBorrowEvent = (input: string, totalAssets: number): Borrow => {
    let to = Address.fromString("0x07fd350bb866d1768b4eeb87b452f1669038fbd0");
    let assignEvent = changetype<Borrow>(newMockEvent())

    assignEvent.parameters = new Array()
    assignEvent.transaction.hash = Bytes.fromHexString("0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654")
    assignEvent.transaction.input = Bytes.fromHexString(input)

    assignEvent.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(to)))
    assignEvent.parameters.push(new ethereum.EventParam("loanId", ethereum.Value.fromBytes(Bytes.fromHexString("0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f"))))
    assignEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("100000000000000"))))
    assignEvent.parameters.push(new ethereum.EventParam("totalAssets", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(totalAssets as i32))))
    assignEvent.parameters.push(new ethereum.EventParam("token", ethereum.Value.fromAddress(Address.fromString("0x163be70e6e126f70af1e7d1ebc531f70b2c85a3b"))))
    return assignEvent
}
const buildRepayEvent = (input: string, unlockedAssets: number, amount: number): Repay => {
    let to = Address.fromString("0x07fd350bb866d1768b4eeb87b452f1669038fbd0");
    let assignEvent = changetype<Repay>(newMockEvent())

    assignEvent.parameters = new Array()
    assignEvent.transaction.hash = Bytes.fromHexString("0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654")
    assignEvent.transaction.input = Bytes.fromHexString(input)

    assignEvent.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(to)))
    assignEvent.parameters.push(new ethereum.EventParam("loanId", ethereum.Value.fromBytes(Bytes.fromHexString("0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f"))))
    assignEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(amount as i32))))
    assignEvent.parameters.push(new ethereum.EventParam("unlockedAssets", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(unlockedAssets as i32))))
    return assignEvent
}
const mockAssetId = (collection: string, tokenId: string, result: string): void => {
    createMockedFunction(Address.fromString('0x2cabdeE7c9Eefb3Eb62A7AB6FbFF4518290d5dc5'), 'assetId', 'assetId(address,uint256):(bytes32)')
        .withArgs([
            ethereum.Value.fromAddress(Address.fromString(collection)),
            ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))
        ])
        .returns([ethereum.Value.fromBytes(Bytes.fromHexString(result))])

}
describe("Describe entity assertions", () => {

    afterEach(() => {
        clearStore();
    });

    test("Assign created and stored single asset", () => {
        const assignEvent = buildBorrowEvent(
            "0xc94b31a6000000000000000000000000163be70e6e126f70af1e7d1ebc531f70b2c85a3b00000000000000000000000000000000000000000000000000005af3107a400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000001baded87ccf06df895fda120f156693ce828698621936e38bd241c5a2a92114c112a5e86358436be22cba6b7b6d3fa4008467453a429a88b79c92e0a2600b7699b0000000000000000000000000000000000000000000000000000018af0d5faa000000000000000000000000000000000000000000000000000000000000000010000000000000000000000004ac593920d734be24250cb0bfac39df621c6e636000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000018af0d5faa0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000018af0d5faa00000000000000000000000000000000000000000000000000000000000000001c8aeed98eb0f411f05a522057ba08ff405ca08bdc24b9de755cddfa5e460be1f"
            , 1)

        mockAssetId("0x4ac593920d734be24250cb0bfac39df621c6e636", "32", "0x0000000000000000000000000000000000000000000000000000000000001234")

        handleBorrow(assignEvent);
        const borrow = BorrowSchema.load('0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f')

        assert.entityCount("Borrow", 1);
        assert.entityCount("Asset", borrow!.totalAssets.toU32() as i32);

        // 0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654 is the transaction hash

        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "user",
            "0x07fd350bb866d1768b4eeb87b452f1669038fbd0"
        );
        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "uToken",
            "0x163be70e6e126f70af1e7d1ebc531f70b2c85a3b"
        );

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
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-32",
            "assetId",
            "0x0000000000000000000000000000000000000000000000000000000000001234"
        );
    })
    test("Assign created and stored multiple asset", () => {
        const assignEvent = buildBorrowEvent("0xc94b31a6000000000000000000000000163be70e6e126f70af1e7d1ebc531f70b2c85a3b00000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000001bd0a278112a08b922ec87cc656064f7606f37db049de3bda9b4fb8b1ce9f2bd8b4b662d084c0b909f95c1023818b7422556d081bffa77e90ea7b4b4f991be14150000000000000000000000000000000000000000000000000000018434252e5100000000000000000000000000000000000000000000000000000000000000020000000000000000000000004ac593920d734be24250cb0bfac39df621c6e63600000000000000000000000000000000000000000000000000000000000000330000000000000000000000004ac593920d734be24250cb0bfac39df621c6e6360000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad78ebc5ac62000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018434252e51000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018434252e510000000000000000000000000000000000000000000000000000000000000002fcb5a36a4bdfff4713b4bc5f294cbad23e4f2c92c07e9eeec58b94e0effaa160c0796bbc61197497c781be988d903ef65c754e50e79fda34f9d875e7d970d7ba", 2)

        mockAssetId("0x4ac593920d734be24250cb0bfac39df621c6e636", "51", "0x0000000000000000000000000000000000000000000000000000000000001234")
        mockAssetId("0x4ac593920d734be24250cb0bfac39df621c6e636", "52", "0x0000000000000000000000000000000000000000000000000000000000001234")

        handleBorrow(assignEvent);
        const borrow = BorrowSchema.load('0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f')

        assert.entityCount("Borrow", 1);
        assert.entityCount("Asset", borrow!.totalAssets.toU32() as i32);

        // 0x1724725a7a99b8aa0a2c8c41206ace892de862288a83b72a999a8d20ee4b1654 is the transaction hash
        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "user",
            "0x07fd350bb866d1768b4eeb87b452f1669038fbd0"
        );
        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "uToken",
            "0x163be70e6e126f70af1e7d1ebc531f70b2c85a3b"
        );

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
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-51",
            "assetId",
            "0x0000000000000000000000000000000000000000000000000000000000001234"
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
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f"
        );
        assert.fieldEquals(
            "Asset",
            "0x4ac593920d734be24250cb0bfac39df621c6e636-52",
            "assetId",
            "0x0000000000000000000000000000000000000000000000000000000000001234"
        );

    })

    test("Only Repay", () => {

        mockAssetId("0x4ac593920d734be24250cb0bfac39df621c6e636", "74", "0x0000000000000000000000000000000000000000000000000000000000001234")
        mockAssetId("0x4ac593920d734be24250cb0bfac39df621c6e636", "75", "0x0000000000000000000000000000000000000000000000000000000000001234")

        const borrowEvent = buildBorrowEvent("0xc94b31a6000000000000000000000000163be70e6e126f70af1e7d1ebc531f70b2c85a3b000000000000000000000000000000000000000000000000000009184e72a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000001c7c196f9b97b644739aa7916e15accb31c695f383cde18eff8da10465daa996f477af1be59a8c909e296c90bbbeccfa8cb58b018aa32f4e8d766c64b689a476d70000000000000000000000000000000000000000000000000000015acd22a95400000000000000000000000000000000000000000000000000000000000000020000000000000000000000004ac593920d734be24250cb0bfac39df621c6e636000000000000000000000000000000000000000000000000000000000000004b0000000000000000000000004ac593920d734be24250cb0bfac39df621c6e636000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad78ebc5ac62000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000015acd22a954000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000015acd22a9540000000000000000000000000000000000000000000000000000000000000002505917ffee65cdeb2e22fc5710b3223a15178f5a1dc51b9498015c51320702e2b073676c88a43181b2d02af3c9298b6c9516d2f905a3289f6442020fe8ac66a7", 2)
        const repayEvent = buildRepayEvent("0xe0deadb90000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001bd5e5d0ded5ebf86ba0808625f28768222b3a115306bffed80ddafdbdea9bf7e45dbcdf642464687abbb14c8b228dbf054600933388fbfdc46dbc5835d26c7f420000000000000000000000000000000000000000000000000000015a60fd1d542e86ddf5c05827d5e5868c6ae5e52fee59f5589d3b48c047fadfeec273b7080d000000000000000000000000000000000000000000000000004485c2286d6c920000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000015a60fd1d54000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000015a60fd1d540000000000000000000000000000000000000000000000000000000000000000", 0, 10000)

        handleBorrow(borrowEvent);
        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "amount",
            "100000000000000"
        );

        handleRepay(repayEvent)
        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "amount",
            "99999999990000"
        );
        const borrow = BorrowSchema.load('0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f')
        assert.entityCount("Borrow", 1);
        assert.entityCount("Asset", 2);
        assert.entityCount("Asset", borrow!.totalAssets.toU32() as i32);

    })
    test("Only withdraw", () => {
        mockAssetId("0x4ac593920d734be24250cb0bfac39df621c6e636", "74", "0x0000000000000000000000000000000000000000000000000000000000001234")
        mockAssetId("0x4ac593920d734be24250cb0bfac39df621c6e636", "75", "0x0000000000000000000000000000000000000000000000000000000000001234")

        const borrowEvent = buildBorrowEvent("0xc94b31a6000000000000000000000000163be70e6e126f70af1e7d1ebc531f70b2c85a3b000000000000000000000000000000000000000000000000000009184e72a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000001c7c196f9b97b644739aa7916e15accb31c695f383cde18eff8da10465daa996f477af1be59a8c909e296c90bbbeccfa8cb58b018aa32f4e8d766c64b689a476d70000000000000000000000000000000000000000000000000000015acd22a95400000000000000000000000000000000000000000000000000000000000000020000000000000000000000004ac593920d734be24250cb0bfac39df621c6e636000000000000000000000000000000000000000000000000000000000000004b0000000000000000000000004ac593920d734be24250cb0bfac39df621c6e636000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad78ebc5ac62000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000015acd22a954000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000015acd22a9540000000000000000000000000000000000000000000000000000000000000002505917ffee65cdeb2e22fc5710b3223a15178f5a1dc51b9498015c51320702e2b073676c88a43181b2d02af3c9298b6c9516d2f905a3289f6442020fe8ac66a7", 2)
        const onlyRepayEvent = buildRepayEvent("0xe0deadb90000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001bd5e5d0ded5ebf86ba0808625f28768222b3a115306bffed80ddafdbdea9bf7e45dbcdf642464687abbb14c8b228dbf054600933388fbfdc46dbc5835d26c7f420000000000000000000000000000000000000000000000000000015a60fd1d542e86ddf5c05827d5e5868c6ae5e52fee59f5589d3b48c047fadfeec273b7080d000000000000000000000000000000000000000000000000004485c2286d6c920000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000015a60fd1d54000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000015a60fd1d540000000000000000000000000000000000000000000000000000000000000000", 0, 10000)
        const onlyWithdrawEvent = buildRepayEvent("0xe0deadb9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001cbcc42585627740b4e09a86eb69c1c64994ca3b39ce2cb13f7b628172cc2100605215463a7699f53d218cb1bfa47ddb9f480143b94c85c6f165208a2b616bfc3e0000000000000000000000000000000000000000000000000000015a60fd1d542e86ddf5c05827d5e5868c6ae5e52fee59f5589d3b48c047fadfeec273b7080d000000000000000000000000000000000000000000000000004485c2286d6c920000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000002134000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000015a60fd1d54000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000015a60fd1d5400000000000000000000000000000000000000000000000000000000000000018722e5ceabe4dd42157f41604f82b163a47e14a04f8161a8f251459b0d105035", 1, 0)

        handleBorrow(borrowEvent);
        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "amount",
            "100000000000000"
        );

        handleRepay(onlyRepayEvent)
        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "amount",
            "99999999990000"
        );

        const borrow = BorrowSchema.load('0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f')
        assert.entityCount("Borrow", 1);
        assert.entityCount("Asset", 2);
        assert.entityCount("Asset", borrow!.totalAssets.toU32() as i32);
        handleRepay(onlyWithdrawEvent)
        assert.entityCount("Asset", 1);

        assert.fieldEquals(
            "Borrow",
            "0xedc91659458f8ea15d176710d79ae82a7cf7a853cc72c15fcb26246ca3b3745f",
            "totalAssets",
            "1"
        );

    })
    test("Repay and withdraw asset", () => {
    })

})

