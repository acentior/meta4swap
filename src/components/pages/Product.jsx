// import avalanche from "../assets/avalanche-avax-logo.png";
import Spinner from "../shared/Spinner";
import ethSymbol from "../assets/Ethereum-Symbol.png";

import StarRating from "../actions/StarRating";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import m4sAbi from "../abi/m4s_abi.json";
import Web3 from "web3/dist/web3.min.js";

function Product({ userAddress }) {
  const ethSym = <img className="eth" src={ethSymbol} alt="eth" />;

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState({ quantity: 1 });
  const [listingData, setListingData] = useState({});

  const navigate = useNavigate();
  const params = useParams();
  let itemId = params.listingId;

  useEffect(() => {
    const fetchEthPrice = async () => {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(
          "https://goerli.infura.io/v3/18c3956af9734c289bfed9eee03ee1a7"
        )
      );
      const M4SContract = new web3.eth.Contract(
        m4sAbi,
        "0xC774Cf50715DCF2d50b7333e1c216bEF67E7D4E4"
      );

      const ethPrice = await M4SContract.methods.getLatestPrice().call();

      console.log(ethPrice);
      window.ethPrice = ethPrice;
    };

    const getItem = async () => {
      // const itemId = 1;
      const web3 = new Web3(
        new Web3.providers.HttpProvider(
          "https://goerli.infura.io/v3/18c3956af9734c289bfed9eee03ee1a7"
        )
      );
      const M4SContract = new web3.eth.Contract(
        m4sAbi,
        "00xC774Cf50715DCF2d50b7333e1c216bEF67E7D4E4"
      );

      const itemInfo = await M4SContract.methods.itemInfo(itemId).call();

      console.log(itemInfo["id"]);
      console.log(itemInfo["metadata"]);
      console.log(itemInfo["owner"]);
      console.log(itemInfo["isLive"]);
      console.log(itemInfo["price"]);
      console.log(itemInfo["serviceType"]);

      fetch(itemInfo["metadata"])
        .then((response) => response.json())
        .then((data) => {
          setListingData(data);
          setLoading(false);
        });
    };

    fetchEthPrice();

    getItem();
  }, [navigate, params.listingId]);

  const onChange = (e) => {
    setQuantity(() => ({
      [e.target.id]: e.target.value,
    }));
  };
  const buyNow = async (e) => {
    console.log(quantity["quantity"]);
    e.preventDefault();
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    var account = accounts[0];

    const M4SContract = new web3.eth.Contract(
      m4sAbi,
      "0xC774Cf50715DCF2d50b7333e1c216bEF67E7D4E4",
      {
        from: account,
      }
    );

    const orderPrice =
      ((listingData.price * 10 ** 18) / window.ethPrice) *
      10 ** 8 *
      quantity["quantity"];
    const slippage = parseInt((orderPrice * 100) / 10000);

    console.log(orderPrice);
    console.log(slippage);

    console.log(orderPrice / 10 ** 18);

    M4SContract.methods
      .createOrder(itemId, quantity["quantity"])
      .send({
        from: account,
        value: orderPrice + slippage,
      })
      .on("receipt", function () {
        navigate(`/transactions/${userAddress}`);
      });
  };

  console.log(listingData);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div>
            <Link to={`/account/${listingData.id}`}>
              <h2 className="text-xl font-bold ml-5 pt-4">
                {`Creator : ${listingData.id.substring(
                  0,
                  5
                )}...${listingData.id.substring(listingData.id.length - 4)}`}
              </h2>
            </Link>
          </div>
          <div className="hero min-h-screen ">
            <div className="hero-content px-auto productImg flex-col lg:flex-row">
              <img src={listingData.imageUrl} alt="product" />
              <div className="card-body mx-20 pl-20 items-center text-center">
                <h1 className="text-5xl font-bold items-center">
                  {listingData.productName}
                </h1>
                <div>
                  <p className="text-2xl items-center py-3">Ratings</p>
                  <StarRating />
                </div>
                <p className="text-3xl font-bold mr-3 py-3">{`${
                  listingData.priceUnit === "USD" ? "$" : "€"
                }${listingData.price} ${listingData.priceUnit}`}</p>
                <div
                  className="flex"
                  style={{
                    justifyContent: "space-evenly",
                  }}
                >
                  <p className="text-2xl pb-8 ">
                    (
                    {(
                      (((listingData.price * 10 ** 18) / window.ethPrice) *
                        10 ** 8) /
                      10 ** 18
                    ).toFixed(3)}{" "}
                    {ethSym})
                  </p>
                </div>
                <div
                  className="flex"
                  style={{
                    justifyContent: "space-evenly",
                  }}
                >
                  <select
                    className="select select-ghost max-w-xs"
                    onChange={onChange}
                    id="quantity"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                  </select>
                </div>
                <button
                  className="btnBuy btn-primary text-white text-2xl font-bold"
                  onClick={buyNow}
                >
                  Buy Now!
                </button>
                <h2 className="pt-6 text-xl font-bold ">Product Description</h2>
                <p className="py-6">{listingData.description}</p>
              </div>
            </div>
          </div>
          )
        </>
      )}
    </>
  );
}

export default Product;
