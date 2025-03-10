import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SidebarNavigation from "../components/menubar";
import NavBar from "../components/navbar";

const COINS = [
  { symbol: "BTC", name: "Bitcoin", logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { symbol: "ETH", name: "Ethereum", logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { symbol: "DOGE", name: "Dogecoin", logo: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
  { symbol: "SOL", name: "Solana", logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { symbol: "BNB", name: "Binance Coin", logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=026" },
];

const TrendingStocks = () => {
  const [cryptoData, setCryptoData] = useState({});

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws");

    ws.onopen = () => {
      console.log("WebSocket Connected!");
      ws.send(JSON.stringify({ 
        method: "SUBSCRIBE",
        params: COINS.map((coin) => `${coin.symbol.toLowerCase()}usdt@ticker`),
        id: 1
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.s && message.c) {
        setCryptoData((prevData) => ({
          ...prevData,
          [message.s.replace("USDT", "")]: {
            PRICE: parseFloat(message.c),
            CHANGEPCT24HOUR: parseFloat(message.P),
          },
        }));
      }
    };

    ws.onclose = () => {
      console.warn("WebSocket Disconnected.");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      <NavBar />
      <div className="w-screen h-[calc(100vh-10vh)] flex overflow-hidden">
        <SidebarNavigation className="w-64 bg-gray-900" />
        <div className="flex-1 flex flex-col p-4 h-full overflow-hidden">
          <h1 className="text-2xl font-bold p-4 text-center">Trending Cryptos</h1>
          <div className="grid grid-cols-3 gap-4 w-full overflow-hidden">
            {COINS.map(({ symbol, name, logo }, index) => {
              const crypto = cryptoData[symbol] || {};
              return (
                <Link to={`/stocks/${symbol}`} key={index} className="no-underline">
                  <div className="flex justify-around items-center p-3 bg-gray-800 rounded-lg shadow-md cursor-pointer">
                    <img src={logo} alt={name} className="w-8 h-8 mr-3" />
                    <span className="text-white font-bold mr-2">{symbol}</span>
                    <span className={`text-sm mr-2 ${crypto.CHANGEPCT24HOUR >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {crypto.CHANGEPCT24HOUR ? `${crypto.CHANGEPCT24HOUR.toFixed(2)}%` : "N/A"}
                    </span>
                    <span className="text-green-300 font-semibold">
                      {crypto.PRICE ? `$${crypto.PRICE.toFixed(2)}` : "Loading..."}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingStocks;
