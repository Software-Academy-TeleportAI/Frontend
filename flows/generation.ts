import axios from "axios";

type TGenerationData = {
  repo_url: string;
  repo_name: string;
  tehnical: boolean;
  authToken: string;
};

type TGenerationStatusData = {
  jobId: string;
  authToken: string;
};

class GenerationFlow {
  async generateRepositoryAnalysis(data: TGenerationData) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const response = await axios.post(
      `${serverUrl}/api/generate`,
      {
        repo_url: data.repo_url,
        repo_name: data.repo_name,
        tehnical: data.tehnical,
      },
      {
        headers: {
          Authorization: `Bearer ${data.authToken}`,
          Accept: "application/json",
        },
      },
    );

    return response.data;
  }

  async generateStatus(data: TGenerationStatusData) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const response = await axios.get(
      `${serverUrl}/api/generate/status/${data.jobId}`,
      {
        headers: {
          Authorization: `Bearer ${data.authToken}`,
          Accept: "application/json",
        },
      },
    );
    return response.data;
  }
}

const GenerationFlowEntity = new GenerationFlow();

export default GenerationFlowEntity as GenerationFlow;
