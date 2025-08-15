import dns from 'dns';

export function validationEmail(dominio) {
    const domainProhibited = ['email.com', 'teste.com', 'example.com']
    if (domainProhibited.includes(dominio)) {
      return false;
    }
    return new Promise((resolve, reject) => {
    dns.resolveMx(dominio, (err, address) => {
      if ( err || !address || address.length === 0) {
        reject({ error: "Email não encontrado" })
      } else {
        resolve({ message: "Email encontrado", domain: dominio })
      }
    });
  });
}

