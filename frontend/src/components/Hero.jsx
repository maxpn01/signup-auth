import { Container, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

const Hero = () => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <div className=" py-5">
            <Container className="d-flex justify-content-center">
                <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
                    <h1 className="text-center mb-4">Signup App with Authentication</h1>

                    <p className="text-center mb-4">
                        This is a MERN application made for a training course as task #4. 
                        It stores a JWT in an HTTP-Only cookie and uses Vite, Redux Toolkit, and React Bootstrap.
                    </p>

                    <div className="d-flex">
                        <LinkContainer to="/login">
                            <Button variant="primary" className="me-3" disabled={userInfo ? true : false}>Log In</Button>
                        </LinkContainer>
                        <LinkContainer to="/signup">
                            <Button variant="secondary" disabled={userInfo ? true : false}>Sign up</Button>
                        </LinkContainer>
                    </div>
                </Card>
            </Container>
        </div>
    );
};

export default Hero;