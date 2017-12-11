pragma solidity ^0.4.18;
contract Ballot {

   uint winer = 0;
   uint max = 0;
   address owner;
   struct Candidate {
       uint counter;
   }

   mapping (uint => Candidate) candidates;
   mapping (address => uint) voters;

   function Ballot () public {
       owner = msg.sender;

      for (uint i = 0; i < 3 ;i++){
          candidates[i+1] = Candidate(0);
      }
   }

   function vote (uint id) public {
        Candidate storage candidate = candidates[id];

        candidate.counter ++;

        if (candidates[id].counter >= max){
            winer = id;
            max = candidates[id].counter;
        }
   }

   function getCounter (uint id) public constant returns (uint _counter) {
       _counter = candidates[id].counter;
   }

   function getWiner () public constant returns (uint _id) {
       _id =  winer;
   }

   function getCandidates () public returns (uint[3]) {
        uint[3] storage data;
        for (uint i = 0; i < 3 ;i++){
            data[i] = candidates[i+1].counter;
        }
       return data;
   }
}