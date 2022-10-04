import nodemailer from 'nodemailer'

const sendEmail = async (req, res) => {
    try {
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.CONFIG_EMAIL}`,
                pass: `${process.env.CONFIG_EMAIL_PASS}`,
            },
        })

        // setup email data with unicode symbols
        var mailOptions = {
            from: `${process.env.CONFIG_EMAIL}`,
            to: req.body.employee.personal_email,
            subject: 'Payroll Slip Shayan Solutions',
            text: ' "Hi",\n You have successfully created an account"',
            html: `<h4>Hi ${req.body.employee.first_name} ${req.body.employee.last_name}</h4>
      <br>
      <p>Please find your attached salary slip for ${req.body.employee.salary_date}
      <br>
      Note: Your salary slip is confidential document should not be shared with anyone
      </p>`, // html body
        }

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({ message: error.message, success: false })
            }
            return res.status(200).json({
                message: `Message sent to id, ${info.messageId}`,
                success: true,
            })
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

export default {
    sendEmail,
}
