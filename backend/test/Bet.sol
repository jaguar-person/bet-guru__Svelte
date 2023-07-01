pragma solidity >=0.5.0 <0.7.0;

import "../contracts/Bet.sol";

contract BetTesthelper is Bet {
    uint256 timestamp;
    int256 price;

    constructor(
        uint256 _firstDay,
        uint256 _contestPeriod,
        address _dai,
        address[] memory _chainlinkTokenRefs
    ) public Bet(_firstDay, _contestPeriod, _dai, _chainlinkTokenRefs) {}

    function setTimestamp(uint256 _timestamp) public returns (uint256) {
        timestamp = _timestamp;
    }

    function getTimestamp() public override returns (uint256) {
        return timestamp;
    }

    function getLatestTokenPrice(uint256 _tokenId)
        public
        override
        returns (int256)
    {
        uint8 betDay = getCurrentDay();
        uint16 betId = u8Concat(betDay, uint8(_tokenId));
        TokenDay memory bet = bets[betId];
        if (bet.startPrice != 0) {
            return price;
        } else {
            return int256(_tokenId) + price;
        }
    }

    function setLatestTokenPrice(int256 _price) public {
        price = _price;
    }

    function u8ConcatPub(uint8 _l, uint8 _r) public pure returns (uint16) {
        return u8Concat(_l, _r);
    }

    function rankPub(int256[] memory input)
        public
        pure
        returns (uint8[] memory)
    {
        return rank(input);
    }
}
