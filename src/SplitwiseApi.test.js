const SplitwiseApi = require("./SplitwiseApi");
const testData = require("./testData");

describe("SplitwiseApi", () => {

	const GROUP_ID = 241392;
	let api;
	let splitwiseMock;

	beforeEach(() => {
		splitwiseMock = {
			getGroup: jest.fn()
		};

		api = new SplitwiseApi(splitwiseMock, GROUP_ID)
	});

	it("should get group balance", async () => {
		// given
		const mockedResponse = testData.splitwise.groupResponseBuilder()
			.withId(GROUP_ID)
			.withMember(testData.splitwise.createMember(1, "-12.31"))
			.withMember(testData.splitwise.createMember(2, "1", "EUR"))
			.build();
		splitwiseMock.getGroup.mockResolvedValue(mockedResponse);

		// when
		const groupBalance = await api.getGroupBalance();

		// then
		expect(splitwiseMock.getGroup).toHaveBeenCalledWith({ id: GROUP_ID });
		expect(groupBalance.length).toBe(2);
		expect(groupBalance[0]).toEqual({ id: 1, name: "First name Last name", amount: -12.31, currency: "PLN" });
		expect(groupBalance[1]).toEqual({ id: 2, name: "First name Last name", amount: 1, currency: "EUR" });
	});

	it("should return sorted group balance", async () => {
		// given
		const mockedResponse = testData.splitwise.groupResponseBuilder()
			.withId(GROUP_ID)
			.withMember(testData.splitwise.createMember(1, "12.31"))
			.withMember(testData.splitwise.createMember(2, "-21.09"))
			.withMember(testData.splitwise.createMember(3, "100.99"))
			.withMember(testData.splitwise.createMember(4, "-31.14"))
			.withMember(testData.splitwise.createMember(5, "0.00"))
			.build();
		splitwiseMock.getGroup.mockResolvedValue(mockedResponse);

		// when
		const groupBalance = await api.getGroupBalance();

		// then
		expect(groupBalance.map(b => b.id)).toEqual([4, 2, 5, 1, 3]);
	});

});
