import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  email: yup
    .string()
    .email()
    .required("Must include an email"),
  terms: yup.boolean().oneOf([true], "please agree to terms of use"),
  password: yup.string()
});

export default function Form() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    terms: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    terms: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [post, setPost] = useState([]);

  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setButtonDisabled(!valid);
    });
  }, [formState]);

  const validateChange = e => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ""
        });
      })
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors
        });
      });
  };
  const formSubmit = e => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then(res => {
        setPost(res.data);
        console.log("success", post);

        setFormState({
          name: "",
          email: "",
          terms: "",
          password: ""
        });
      })
      .catch(err => {
        console.log(err.res);
      });
  };

  const inputChange = e => {
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };
    validateChange(e);
    setFormState(newFormData);
  };

  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name
        <input
          id="name"
          type="text"
          name="name"
          className="name_input"
          value={formState.name}
          onChange={inputChange}
        />
        {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
      </label>

      <label htmlFor="email">
        Email
        <input
          className="email_input"
          id="email"
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
        {errors.email.length > 0 ? (
          <p className="error"> {errors.email}</p>
        ) : null}
      </label>

      <label htmlFor="password">
        Password
        <input id="password"
        className="password_input"
        type="password" 
        name="password" 
        onChange={inputChange}
        />
      </label>
      <label htmlFor="terms" className="terms">
        <input
          type="checkbox"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        Terms And Conditions
      </label>
      <pre>{JSON.stringify(post, null, 2)}</pre>
      <button disabled={buttonDisabled} className="submit">Submit user</button>
    </form>
  );
}
