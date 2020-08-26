import React, { useState } from "react";
import { Link } from "react-router-dom";

export const RegisterUser = () => {
  const [name, setName] = useState<string>("Jane Doe");
  const submit = () => {};

  return (
    <div className="container center">
      <h1>Enter User Name</h1>
      <form action="POST">
        <label htmlFor="username"></label>
        <input
          type="text"
          name="username"
          onChange={(e: any) => {
            setName(e.target.value);
          }}
        />
        <Link to={{
          pathname:`/draw/${name}`,
        }}>
          <input type="button" value="Register" />
        </Link>
      </form>
    </div>
  );
};
