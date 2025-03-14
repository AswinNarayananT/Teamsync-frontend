import VantaBackground from "../components/VantaBackground";

const Login = () => {
    return (
      <VantaBackground>
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input className="border p-2 w-full mb-4" type="email" placeholder="Email" />
          <input className="border p-2 w-full mb-4" type="password" placeholder="Password" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        </div>
      </VantaBackground>
    );
  };
  
  export default Login;