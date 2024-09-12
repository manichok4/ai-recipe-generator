import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Auth } from "@aws-amplify/auth";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }

  
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      // Optionally, you can redirect the user to a login page or the home page
      // window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Existing code */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default App;
