import { Redis } from "@upstash/redis";

const OverallBalance: React.FC = async() => {
  const redis = Redis.fromEnv();
  const count = await redis.incr("counter");

  return (
    <>
      <h1 className="font-title text-5xl">Overall Balance</h1>
      <h2 className="font-title text-7xl text-primaryColor m-4">$ {count}</h2>
    </>
  );
};

export default OverallBalance;
