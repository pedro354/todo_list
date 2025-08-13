import bcrypt from 'bcrypt';

// senha digitada no login
const senhaDigitada = "Nahida354@";

// hash que está no banco
const hashBanco = "$2b$10$a9ETqnYvGR.xQxN2AJge2./1Sh0CqgD6aNrgIjruJ1m26j4jXTCTG";

// função para testar a comparação
(async () => {
  const resultado = await bcrypt.compare(senhaDigitada, hashBanco);

  if (resultado) {
    console.log("✅ Senha correta!");
  } else {
    console.log("❌ Senha inválida!");
  }
})();
