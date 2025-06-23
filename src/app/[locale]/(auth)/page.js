import { Login } from "./actions";


export default function Page() {
  // const [error, action, isLoading] = useActionState(Login, "")
  // const router = useRouter();
console.log('23')
  return (
    <div>
      <form
      action={Login}
      // onSubmit={async (e) => {
      //   console.log('Form submitted');
      //   e.preventDefault();
      //   const result = await Login(JSON.stringify({
      //     username: e.target.username.value,
      //     password: e.target.password.value,
      //   }))

      //   if (result.success) {
      //     console.log('Login successful:');
      //     // Redirect to dashboard or another page after successful login
      //     router.push('/dashboard');
      //     console.log('Redirecting to dashboard...');
      //   } else {
      //     console.error('Login failed: ', result.error);
      //   }
        
      //   // router.push('/dashboard');
      // }}
      >

        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
