"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"


type UserData = {
  uuid: string;
  username: string;
  email: string;
  password: string;
  created_at: string;
}


const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).max(12, { message: "Password must be at most 12 characters." }),
});

const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).max(12, { message: "Password must be at most 12 characters." }),
  confirmPassword: z.string(),
});

export function InputForm() {

  // State to store user data
  const [users, setUsers] = useState<UserData[]>([]);

  // Fetch user data
  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }
    , []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegister = (data: z.infer<typeof RegisterSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "The password and confirm password do not match.",
        variant: "destructive",
      });
    } else {
      // Send a POST request to the /register endpoint
      fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error) {
            toast({
              title: "Registration Failed",
              description: result.error,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Account Created",
              description: "Your account has been created successfully.",
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "An error occurred during registration.",
            variant: "destructive",
          });
        });
    }
  };



  // THE ISSUE IS HERE
  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message) {
          // If there is a message, it's an error
          toast({
            title: "Login Failed",
            description: result.message,
            variant: "destructive",
          });
        } else {
          // Otherwise, login is successful
          toast({
            title: "Login Successful",
            description: "You have been logged in successfully.",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An error occurred during login.",
          variant: "destructive",
        });
      });
  }





  return (
    <>
      <div>
        <div className="flex items-center h-screen w-full">
          <div className="w-1/2">
            <div className="text-center mb-10">
              <img src="/logo.svg" alt="logo" className="w-20 mx-auto" />
              <h1 className="text-3xl font-bold mt-4">Welcome back</h1>
              <p className="text-slate-500 mt-2">
                Sign in to your account to continue
              </p>
            </div>
          </div>

          <div className="w-1/2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 mx-auto space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <Dialog>
                  <DialogTrigger asChild>
                    <p className="text-sm text-right text-slate-500 cursor-pointer hover:underline">
                      Forgot password?
                    </p>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Reset your password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Your email
                        </Label>
                        <Input id="email" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button className="w-1/2 flex justify-center">
                        Send reset link
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* <hr className="mb-6" /> */}

                {/* <FormMessage>
                <p className="text-red-500">This is an error message</p>
              </FormMessage> */}

                <div className="flex justify-between items-center space-x-4">
                  <Button type="submit" className="w-full flex justify-center">
                    Sign in
                  </Button>
                </div>
                <div>
                  <div className="flex justify-center items-center space-x-2">
                    <hr className="w-1/2" />
                    <p className="text-slate-500 text-sm">or</p>
                    <hr className="w-1/2" />
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-4">
                    <Button className="w-full flex justify-center" variant="outline" onClick={() => signIn("google")} disabled={true}>
                      <img src="/google.svg" alt="google" className="w-5 h-5" />
                    </Button>
                    <Button className="w-full flex justify-center" variant="outline" onClick={() => signIn("apple")}  disabled={true}>
                      <img src="/apple.svg" alt="apple" className="w-4 h-5" />
                    </Button>
                    <Button className="w-full flex justify-center" variant="outline" onClick={() => signIn("facebook")}  disabled={true}>
                      <img src="/facebook.png" alt="facebook" className="w-2 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-center mt-4 text-slate-500">
                  Don't have an account?{" "}
                  <Dialog>
                    <DialogTrigger>
                      <p className="text-blue-500 cursor-pointer hover:underline">
                        Click here
                      </p>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                          Create your account
                        </DialogTitle>
                        <DialogDescription>
                          Let's get you started! Fill in the form below to create your account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Your full name
                          </Label>
                          <Input id="name" className="col-span-3" placeholder="John Doe" {...registerForm.register("name")} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Your username
                          </Label>
                          <Input id="username" className="col-span-3" placeholder="@johndoe" {...registerForm.register("username")} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Your email
                          </Label>
                          <Input id="email" className="col-span-3" placeholder="john@doe.com" {...registerForm.register("email")} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="password" className="text-right">
                            Password
                          </Label>
                          <Input id="password" type="password" className="col-span-3" {...registerForm.register("password")} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="confirmPassword" className="text-right">
                            Confirm password
                          </Label>
                          <Input id="confirmPassword" type="password" className="col-span-3" {...registerForm.register("confirmPassword")} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-1/2 flex justify-center" onClick={registerForm.handleSubmit(onRegister)}>
                          Create your account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div>
      </div>
    </>
  )
}

export default InputForm
