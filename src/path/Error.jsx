import { Link } from "react-router-dom"

const Error = () => {
  return (
    <div className="flex justify-center items-center w-full text-white flex-col pt-16">
        <h1 className="text-center max-md:text-xl max-md:my-5 text-3xl font-bold my-10 ">Error 404 Page not Found</h1>
        <Link to="/" className="text-xl max-md:text-lg hover:underline">Back to Home</Link>
    </div>
  )
}

export default Error
