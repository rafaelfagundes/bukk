module.exports = {
  mongoURI: "mongodb://localhost:27017/bukk",
  baseURI: "http://localhost:4000",
  jwt: {
    expiresIn: "30d",
    issuer: "Bukk Agendador",
    subject: "bukk@bukk.com.br",
    audience: "http://www.bukk.com.br",
    algorithm: "RS256"
  },
  mailgun: {
    key: "9818a7f9aa1cfe0b625ba71727fc0d25-9525e19d-2f48c152",
    domain: "sandbox43fdf4b6c9044e839cb877fd2a8bdec7.mailgun.org",
    defaultEmail: "no-reply@bukk.com.br"
  },
  cloudinary: {
    cloud_name: "bukkapp",
    api_key: "151549671844987",
    api_secret: "9cc33eiwoXI6vc5hRLkWMkEqpsE"
  }
};
