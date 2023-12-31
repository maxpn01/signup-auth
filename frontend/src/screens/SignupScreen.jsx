import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSignupMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const SignupScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [signup] = useSignupMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword)
            toast.error("Passwords do not match");
        else {
            try {
                const res = await signup({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate("/dashboard");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <FormContainer>
            <h1>Sign Up</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="my-2" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3">Sign Up</Button>
            </Form>

            <Row className="py-3">
                <Col>
                    Already have an account? <Link to={`/login`}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default SignupScreen;