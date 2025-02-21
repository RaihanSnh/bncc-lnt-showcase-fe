import { Link, Outlet } from "@tanstack/react-router"

function App() {
  return (
    <>
      <div>
        <Link to='/'>Landing Page</Link> |
        <Link to='/login'>Login Page</Link> |
        <Link to='/register'>Register Page</Link>
        <Link to='/upload'>Upload Project</Link>
      </div>

      <Outlet/>
    </>
  )
}

export default App