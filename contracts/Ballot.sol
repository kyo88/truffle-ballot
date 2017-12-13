pragma solidity ^0.4.18;


contract Ballot {

    uint winer = 0;
    uint max = 0;
    address owner;
    bool finish = false;

    struct Candidate {
        uint counter;
    }

   mapping (uint => Candidate) candidates;
   mapping (address => uint) voters;

   event VoteResult(uint id, uint counter);

   modifier onlyOwner {
        require(msg.sender == owner && !finish);
        _;
    }

   modifier isOpen {
        require(!finish);
        _;
   }


   function Ballot () public {
       owner = msg.sender;

      for (uint i = 0; i < 3 ;i++){
          candidates[i] = Candidate(0);
      }
   }

   function isFinish() returns (bool) {
      return finish;
   }

   function finishBallot () onlyOwner public {
        finish = true;
   }

   function vote (uint id) isOpen public {

        Candidate storage candidate = candidates[id];

        candidate.counter ++;

        if (candidates[id].counter >= max){
            winer = id;
            max = candidates[id].counter;
        }

        VoteResult(id, candidate.counter);
   }

   function getCounter (uint id) public constant returns (uint _counter) {
       _counter = candidates[id].counter;
   }

   function getWiner () public constant returns (uint _id) {
       _id =  winer;
   }

    function getCandidates () public constant returns (uint[3] _data) {
       uint[3] storage data;
        for (uint i = 0; i < 3; i++) {
             data[i] = candidates[i].counter;
        }
        _data = data;
    }
}
