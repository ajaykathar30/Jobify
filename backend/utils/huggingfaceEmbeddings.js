import axios from "axios";

const HF_EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2";

export const embedTexts = async (texts) => {
  const { data } = await axios.post(
    `https://router.huggingface.co/hf-inference/models/${HF_EMBEDDING_MODEL}/pipeline/feature-extraction`,
    { inputs: texts.map(text => text.replace(/\n/g, " ")) },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

export const meanPoolVectors = (vectors) => {
  const dim = vectors[0].length;
  const pooled = new Array(dim).fill(0);

  for (const vec of vectors) {
    for (let i = 0; i < dim; i++) pooled[i] += vec[i];
  }
  for (let i = 0; i < dim; i++) pooled[i] /= vectors.length;

  return pooled;
};
