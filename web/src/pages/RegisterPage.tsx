import { PropsWithChildren } from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { UserRoute } from "common";

function FormLabel(props: PropsWithChildren) {
  const { children } = props;
  return <label className="text-brand font-bold text-sm">{children}</label>;
}

function RegisterForm() {
  const form = useForm<UserRoute.User>({});

  const onSubmitHandler = (data: UserRoute.User) => {
    console.log("Submitted", data);
  };

  return (
    <form className="max-w-md" onSubmit={form.handleSubmit(onSubmitHandler)}>
      <FormLabel>Name</FormLabel>
      <TextInput {...form.register("name")} />
      <FormLabel>Email</FormLabel>
      <TextInput {...form.register("email")} />
      <FormLabel>Password</FormLabel>
      <TextInput type="password" {...form.register("password")} />

      <Button type="submit">Register</Button>
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
