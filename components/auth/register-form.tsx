"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuthForm } from "@/hooks/use-auth-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  student_id: z.string().optional(),
  faculty: z.string().optional(),
  year_of_study: z.string().optional(),
  phone: z.string().optional(),
  remember: z.boolean().default(false),
})

type RegisterFormValues = z.infer<typeof registerSchema>

const faculties = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Other",
]

const yearOfStudy = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
  { value: "5", label: "5th Year" },
  { value: "6", label: "Graduate" },
]

interface RegisterFormProps {
  currentStep: number
  onStepComplete: () => void
}

function generateStrongPassword() {
  const length = 16
  const charset = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "@$!%*?&"
  }
  
  let password = ""
  // Ensure at least one character from each set
  password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length))
  password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length))
  password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length))
  password += charset.symbols.charAt(Math.floor(Math.random() * charset.symbols.length))
  
  // Fill the rest randomly
  const allChars = Object.values(charset).join("")
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }
  
  // Shuffle the password
  return password.split("").sort(() => Math.random() - 0.5).join("")
}

function calculatePasswordStrength(password: string): number {
  if (!password) return 0
  
  let strength = 0
  const checks = [
    password.length >= 8,                    // +20
    /[A-Z]/.test(password),                 // +20
    /[a-z]/.test(password),                 // +20
    /[0-9]/.test(password),                 // +20
    /[@$!%*?&]/.test(password),            // +20
    password.length >= 12,                  // +10 bonus
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password) // +10 bonus
  ]
  
  strength = checks.slice(0, 5).filter(Boolean).length * 20
  if (checks[5]) strength += 10  // Length bonus
  if (checks[6]) strength += 10  // Complexity bonus
  
  return Math.min(strength, 100)
}

function getPasswordStrengthColor(strength: number): string {
  if (strength < 40) return "bg-red-500"
  if (strength < 70) return "bg-yellow-500"
  return "bg-green-500"
}

export function RegisterForm({ currentStep, onStepComplete }: RegisterFormProps) {
  const { handleSignUp, loading, error } = useAuthForm()
  const [showPassword, setShowPassword] = React.useState(false)
  const [passwordStrength, setPasswordStrength] = React.useState(0)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      student_id: "",
      faculty: "",
      year_of_study: "",
      phone: "",
      remember: false,
    },
  })

  const handlePasswordChange = (value: string) => {
    setPasswordStrength(calculatePasswordStrength(value))
  }

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword()
    form.setValue("password", newPassword)
    handlePasswordChange(newPassword)
  }

  async function onSubmit(data: RegisterFormValues) {
    if (currentStep === 1) {
      // Validate email and password
      if (data.email && data.password) {
        onStepComplete()
      }
      return
    }
    
    // Final step - submit everything
    await handleSignUp(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentStep === 1 ? (
          // Step 1: Account Credentials
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          placeholder="Create a password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          disabled={loading}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handlePasswordChange(e.target.value)
                          }}
                        />
                        <div className="absolute right-0 top-0 h-full flex items-center space-x-1 pr-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 px-0"
                            onClick={handleGeneratePassword}
                            disabled={loading}
                            title="Generate strong password"
                          >
                            <RefreshCw className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 px-0"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Progress value={passwordStrength} className={`h-2 ${getPasswordStrengthColor(passwordStrength)}`} />
                      <FormDescription className="text-xs">
                        {passwordStrength < 40 && "Weak password"}
                        {passwordStrength >= 40 && passwordStrength < 70 && "Moderate password"}
                        {passwordStrength >= 70 && "Strong password"}
                      </FormDescription>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                </FormItem>
              )}
            />
          </div>
        ) : (
          // Step 2: Personal Information
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        autoComplete="given-name"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        autoComplete="family-name"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your student ID"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        type="tel"
                        autoComplete="tel"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty} value={faculty}>
                            {faculty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year_of_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Study</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {yearOfStudy.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        )}
      </form>
    </Form>
  )
} 