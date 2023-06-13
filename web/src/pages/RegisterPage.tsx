import { PropsWithChildren, useState } from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import type { UserRoute } from "common";
import { useMutation } from "@tanstack/react-query";
import { createKy } from "../utility";
import { isEmpty } from "lodash-es";
import { useNavigate } from "react-router-dom";

const ky = createKy();

function FormLabel(props: PropsWithChildren) {
  const { children } = props;
  return <label className="text-brand font-bold text-sm">{children}</label>;
}

function RegisterForm() {
  const form = useForm<UserRoute.User>({});

  const router = useNavigate();

  const [serverMsg, setServerMsg] = useState({ type: "", message: "" });

  const registerMUT = useMutation({
    async mutationFn(data) {
      return await ky.post("api/users/register", { json: data }).json();
    },
    onSuccess(data) {
      setServerMsg({ type: "info", message: JSON.stringify(data) });
      router("/login");
    },
  });

  const onSubmitHandler = (data: UserRoute.User) => {
    console.log("Submitted", data);
    registerMUT.mutate(data);
  };

  return (
    <form className="max-w-md" onSubmit={form.handleSubmit(onSubmitHandler)}>
      <FormLabel>Name</FormLabel>
      <TextInput {...form.register("name")} />
      <FormLabel>Email</FormLabel>
      <TextInput {...form.register("email")} />
      <FormLabel>Password</FormLabel>
      <TextInput type="password" {...form.register("password")} />
      {!isEmpty(serverMsg) ? <div>{serverMsg?.message}</div> : null}

      <div className="mt-4 flex">
        <Button type="submit" className="grow">Register</Button>
      </div>
    </form>
  );
}

function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-xl text-brand">Register your account</h1>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
