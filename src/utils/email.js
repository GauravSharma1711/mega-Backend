import  Mailgen from 'mailgen'
import   nodemailer  from 'nodemailer'

 const sendMail = async (options)=>{
   
    const mailGenerator = new Mailgen({
        theme: 'Task Manager',
        product: {
           
            name: 'Mailgen',
            link: 'https://mailgen.js/'
    
        }
    });

    // Generate an HTML email with the provided contents
const emailHtml = mailGenerator.generate(options.mailgenContent);

// Generate the plaintext version of the e-mail (for clients that do not support HTML)
const emailText = mailGenerator.generatePlaintext(options.mailgenContent);


const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
  
const mail = {
    from: 'gau17sha100@gmail.com', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: emailText, // plain text body
    html: emailHtml, // html body
}

   try {
    await transporter.sendMail(mail);
   } catch (error) {
    console.error("email failed",error);
   }


 }



 const emailVerificationMailGenerator = (username,verificationUrl)=>{

    return {
        body: {
            name: username,
            intro: 'Welcome to our app! We\'re very excited to have you on board.',
            action: {
                instructions: 'to verify account click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'verify your account',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }



 }


 
 const forgotPasswordMailGenerator = (username,passwordResetUrl)=>{

    return {
        body: {
            name: username,
            intro: 'We got a request to reset your password.',
            action: {
                instructions: 'to change your password click here',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'verify your account',
                    link: passwordResetUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }



 }



// sendMail(
//    {
//      email:user.email,
//      subject:"aaa",
//     mailgenContent:emailVerificationMailGenerator(username,verificationUrl)}
// )