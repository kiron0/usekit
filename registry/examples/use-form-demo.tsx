"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { notifySuccess } from "@/components/toast"
import { FormErrors, useForm } from "registry/hooks/use-form"

interface FormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export default function UseFormDemo() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    resetForm,
  } = useForm<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors: FormErrors<FormValues> = {}

      if (!values.firstName) {
        errors.firstName = "First name is required"
      }

      if (!values.lastName) {
        errors.lastName = "Last name is required"
      }

      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Email is invalid"
      }

      if (!values.password) {
        errors.password = "Password is required"
      } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters"
      }

      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords must match"
      }

      return errors
    },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      notifySuccess({
        title: "Registration Successful",
        description: `Welcome, ${values.firstName}! Your registration is complete.`,
      })
      resetForm()
    },
  })

  const fillSampleData = () => {
    setFieldValue("firstName", "John")
    setFieldValue("lastName", "Doe")
    setFieldValue("email", "john.doe@example.com")
    setFieldValue("password", "secure123")
    setFieldValue("confirmPassword", "secure123")
  }

  return (
    <div className="mx-auto w-full max-w-xs">
      <h2 className="mb-6 text-center text-lg font-bold underline underline-offset-4">
        User Registration
      </h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={values.firstName}
            placeholder="Enter your first name"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.firstName && errors.firstName && (
            <p className="text-destructive">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={values.lastName}
            placeholder="Enter your last name"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.lastName && errors.lastName && (
            <p className="text-destructive">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={values.email}
            placeholder="Enter your email"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <p className="text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={values.password}
            placeholder="Enter your password"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password && (
            <p className="text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            placeholder="Confirm your password"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register"}
          </Button>
          <Button variant="secondary" type="button" onClick={fillSampleData}>
            Fill Sample Data
          </Button>
          {Object.keys(values).some(
            (key) => values[key as keyof FormValues]
          ) && (
            <Button variant="destructive" type="button" onClick={resetForm}>
              Clear Form
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
