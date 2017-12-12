App = {
  web3Provider: null,
  contracts: {},
  instructorEvent: null,
  contractIns: null,

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('#avatar').attr('src', data[i].picture);
        petTemplate.find('.candidate-age').text(data[i].age);
        petTemplate.find('.candidate-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Ballot.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      console.log(data);
      var BallotArtifact = data;
      App.contracts.Ballot = TruffleContract(BallotArtifact);

      // Set the provider for our contract
      App.contracts.Ballot.setProvider(App.web3Provider);

      //  Event
      App.contracts.Ballot.deployed().then(function(instance) {
        adoptionInstance = instance;
        App.contractIns = instance;
        App.instructorEvent = adoptionInstance.VoteResult();

        App.instructorEvent.watch(function(error, result){
             if (!error)
                 {
                     console.log('-------------------------');
                 } else {
                     console.log(error);
                 }
         });
      }).catch(function(err) {
        console.log(err);
      });

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Ballot.deployed().then(function(instance) {
      adoptionInstance = instance;

      console.log(instance);

      return adoptionInstance.getCandidates.call();
    }).then(function(data) {

      for (i = 0; i < data.length; i++) {
        $('.panel-pet').eq(i).find('.candidate-counter').text(data[i].toNumber());
        //console.log(data[i].toNumber());
      }
    }).catch(function(err) {
      console.log(err);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      console.log(App.contracts.Ballot.deployed());

      App.contracts.Ballot.deployed().then(function(instance) {
        adoptionInstance = instance;


        // Execute adopt as a transaction by sending account
        return adoptionInstance.vote(petId);
      }).then(function(result) {
        //console.log(result);
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
