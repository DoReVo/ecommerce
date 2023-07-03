import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import type { UserRoute } from "common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKy } from "../utility";
import { useNavigate } from "react-router-dom";

const ky = createKy();

function FormLabel(props: PropsWithChildren) {
  const { children } = props;
  return <label className="text-brand font-bold text-sm">{children}</label>;
}

function LoginForm() {
  const form = useForm<Pick<UserRoute.User, "email" | "password">>();

  const [isVisibleServerError, setIsVisibleServerError] = useState(false);

  const router = useNavigate();

  const qClient = useQueryClient();

  const loginMUT = useMutation({
    async mutationFn(data) {
      return await ky.post("api/users/login", { json: data }).json();
    },
    onSuccess(data) {
      qClient.setQueryData(["me"], data?.user);
      localStorage.setItem("API_TOKEN", data?.token);
      router("/");
    },
    onError: () => {
      setIsVisibleServerError(true);
    },
  });

  const onSubmitHandler = (
    data: Pick<UserRoute.User, "email" | "password">
  ) => {
    console.log("Submitted", data);
    loginMUT.mutate(data);
  };

  return (
    <form className="max-w-md" onSubmit={form.handleSubmit(onSubmitHandler)}>
      <FormLabel>Email</FormLabel>
      <TextInput {...form.register("email")} />
      <FormLabel>Password</FormLabel>
      <TextInput type="password" {...form.register("password")} />

      {isVisibleServerError ? (
        <div className="mt-4 text-red-5 bg-red-1 p-2 rounded">
          Login failed! Incorrect email or password.
        </div>
      ) : null}
      <div className="flex mt-4">
        <Button type="submit" className="grow">
          Login
        </Button>
      </div>
    </form>
  );
}

function Loginpage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-xl text-brand">Login to your account</h1>

      <LoginForm />
    </div>
  );
}

export default Loginpage;
