type TRegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

class AuthenticateFlow {
  async register(formData: TRegisterFormData) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const res = await fetch(`${serverUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        throw new Error(firstError as string);
      }
      throw new Error(data.message || "Registration failed");
    }
    return data;
  }

  async login(email: string, password: string) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const res = await fetch(`${serverUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Authentication failed");

    return data;
  }
}

const AuthenticateFlowEntity = new AuthenticateFlow();

export default AuthenticateFlowEntity as AuthenticateFlow;
