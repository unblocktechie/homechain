import React, { useState, useEffect } from "react";
import { Button, Image, Modal, Input, Header } from 'semantic-ui-react';
import Home from '../abis/Home.json';
import Trade from '../abis/Trade.json';
import Web3 from 'web3';

function House(props){   
    const [open, setOpen] = useState(false);
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState("");
    const id = props.id;
    const imgSrc = "images/home-"+props.id+".png";
    const [ipData, setIpData] = useState({price : "" });
    let [address,setAddress] = useState("");

    let [account, setAccount] = useState("");
    const [homeContract, setHomeContract] = useState({});
    const [trade, setTrade] = useState({});

    let [house, setHouse] = useState({});
    let [owner, setOwner] = useState("");
    const [sell, setSell] = useState({});
    const [data,setData] = useState(false);

    async function loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }
  

    async function loadBlockchainData(){
        const web3 = window.web3;
       
            web3.eth.getAccounts()
            .then(res=>{
                setAccount(res[0]);
            })
            .catch(err=>{
                setMessage("please select your ethereum account");
            })  
          
        const networkId = await web3.eth.net.getId();
        
        const homeData = Home.networks[networkId];
            if(homeData) {
                const hdc = new web3.eth.Contract(Home.abi, homeData.address);
                setHomeContract(hdc);

                const hd = await hdc.methods.homes(id-1).call();
                setHouse({
                        name:hd.name,
                        regNo:hd.regNumber.toString(),
                        addr:hd.propertyAddress,
                        area:hd.area.toString(),
                        year:hd.year.toString(),
                        floors:hd.numberOfFloors.toString(),
                        rooms:hd.numberOfRooms.toString()
                    }); 
                setData(true);
                const onr = await hdc.methods.ownerOf(id).call();
                setOwner(onr);

            } else {
              setMessage('Home contract not deployed to detected network. Please select Ropsten Test Network. ');
            }
        
            const tradeData = Trade.networks[networkId];
            if(tradeData) {
                const trc = new web3.eth.Contract(Trade.abi, tradeData.address);
                setAddress(tradeData.address);
                setTrade(trc);

                const ifs = await trc.methods.homeList(id).call();
                let amount = web3.utils.fromWei(ifs.price.toString(),'Ether');
                setSell({forSell:ifs.forSell, price:amount});
            } else {
              setMessage('Trade contract not deployed to detected network. Please select Ropsten Test Network.');
            }       
    } 
      
        useEffect(() => {
          loadWeb3();  
          loadBlockchainData();
        },[])

    function handleChange(event) {
        const { name, value } = event.target;  
            setIpData(prevIpData => {
              return {
                ...prevIpData,
                [name]: value
              };
            });
    }      
    
    function listHome(){
        setLoading(true);
        let etherAmount;
        etherAmount = ipData.price.toString();
        etherAmount = window.web3.utils.toWei(etherAmount, 'Ether');

        homeContract.methods.approve(address,id).send({from:account})
        .once('confirmation',((confirmation)=>{
            trade.methods.listHome(id, etherAmount).send({from:account})
            .once('confirmation',(confirmation)=>{
                setMessage("Home successfully listed for sell");
                setLoading(false);
            })
            .on('error',(error)=>{
                setMessage("something went wrong. please try again.");
                setLoading(false);
            });
        }))
        .on('error',(error)=>{
            setMessage("something went wrong. please try again.");
            setLoading(false);
        });
    }

    function buyHome(){
        setLoading(true);
        const etherAmount = window.web3.utils.toWei(sell.price, 'Ether');
        trade.methods.buyHome(id).send({value:etherAmount , from:account})
        .once('confirmation', (confirmation) => {
          setLoading(false);
          setMessage("transaction successful.");
        })
        .on('error', (error) => {
            setMessage("Transaction failed. Try again!");
            setLoading(false);
        });
    }

    return (
      <Modal
        closeIcon
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<img className="mountain" src={imgSrc}  width ="15%" alt="house-img" />}
      >
        <Modal.Header> {house.name} </Modal.Header>
        <Modal.Content image>
          <Image size='medium' src={imgSrc} wrapped />
          <Modal.Description>
            {loading?
            <Header>loading...please wait...It may take 5-10 minutes...</Header>
            :<Header>{message}</Header>
            }
            {(data)&&(<>  
            <p><b>Registration Number : </b> {house.regNo} </p>
            <p><b>Owner : </b> {owner} </p>
            <p><b>Address : </b> {house.addr} </p>
            <p><b>Area : </b> {house.area} square yard </p>
            <p><b>Year : </b> {house.year} </p>
            <p><b>Number of floors : </b> {house.floors} </p>
            <p><b>Number of rooms : </b> {house.rooms} </p></>)
            }
            {sell.forSell&&<p><b>Price : </b> {sell.price} ETH </p>}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
        {(account===owner)?
                <>
                <Input placeholder='Add price in ETH'
                    name='price'
                    value={ipData.price}
                    onChange={handleChange} />
                <Button color='red' onClick={listHome}>
                    List for Sell 
                </Button>
                </>
        :(sell.forSell)?<Button color='red' onClick={buyHome}>
                        Buy @ {sell.price} ETH
                        </Button>
        :<Button color="black" onClick={() => setOpen(false)}>Not for sell</Button>        
        }
        </Modal.Actions>
      </Modal>
    );
}

export default House;