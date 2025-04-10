
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Oops! The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
