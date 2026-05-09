require("dotenv").config();

const fs = require("fs");
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const nodemailer = require("nodemailer");

const app = express();
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));

// ===============================
// STATIC FILES
// ===============================
app.use(express.static(path.join(__dirname, "public")));


// ===============================
// SESSION
// ===============================
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);


// ===============================
// PASSPORT
// ===============================
app.use(passport.initialize());
app.use(passport.session());


// ===============================
// ALLOWED USERS
// ===============================
const allowedUsers = [
    "vishaldigitalseluru@gmail.com",
    "luckyjaladi1674@gmail.com",
    "rameshjrly@gmail.com",
    "vishaldigitalsadmin@gmail.com"
];


const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }

});

// ===============================
// GOOGLE STRATEGY
// ===============================
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },

        (accessToken, refreshToken, profile, done) => {

            const email = profile.emails[0].value;

            if (allowedUsers.includes(email)) {
                return done(null, profile);
            } else {
                return done(null, false);
            }
        }
    )
);


// ===============================
// SERIALIZE USER
// ===============================
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


// ===============================
// ROUTES
// ===============================

// LOGIN PAGE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});


// GOOGLE LOGIN
app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);


// GOOGLE CALLBACK
app.get(
    "/auth/google/callback",

    passport.authenticate("google", {
        failureRedirect: "/denied",
    }),

    (req, res) => {
        res.redirect("/form");
    }
);


// FORM PAGE
app.get("/form", (req, res) => {

    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "views", "form.html"));
});

app.get("/preview", (req, res) => {

    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    res.sendFile(
        path.join(__dirname, "views", "preview.html")
    );
});

// ACCESS DENIED
app.get("/denied", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "denied.html"));
});


// SUCCESS PAGE
app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "success.html"));
});


// ===============================
// SERVER
// ===============================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/submit", async (req, res) => {

        const {
            customerName,
            mobile,
            whatsapp,
            sector,
            item,
            size,
            quantity,
            totalBill,
            advancePayment,
            more1,
            more2,
            description,
            billNumber,
            billDate
        } = req.body;


    const mailOptions = {

    from: process.env.EMAIL_USER,

    to: "vishaldigitalsadmin@gmail.com",

    subject: `Invoice - ${customerName}`,

    html: `

    <div style="
        background:#f3f4f6;
        padding:40px 20px;
        font-family:Arial,sans-serif;
    ">

        <div style="
            max-width:850px;
            margin:auto;
            background:white;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 10px 40px rgba(0,0,0,0.08);
        ">

            <!-- HEADER -->
            <div style="
                padding:30px 40px;
                border-bottom:2px solid #f1f1f1;
                display:flex;
                align-items:flex-start;
            ">

                <div>
                    <img
                        src="https://vd-invoice-system.onrender.com/logo.png"
                        style="
                            width:110px;
                            height:110px;
                            object-fit:contain;
                            border-radius:50%;
                        "
                    >
                </div>

                <div style="
                    margin-left:auto;
                    text-align:right;
                ">

                    <h1 style="
                        margin:0;
                        color:#1f6980;
                        font-size:38px;
                    ">
                        INVOICE
                    </h1>

                    <p style="margin-top:12px; font-size:18px;">
                        <strong>Bill Number:</strong>
                        VD-${Date.now()}
                    </p>

                    <p style="margin-top:8px; font-size:18px;">
                        <strong>Date:</strong>
                        ${new Date().toLocaleDateString()}
                    </p>

                </div>

            </div>


            <!-- CUSTOMER DETAILS -->
            <div style="padding:40px;">

                <h2 style="
                    margin-bottom:25px;
                    color:#111827;
                    font-size:30px;
                ">
                    Customer Details
                </h2>

                <table style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:18px;
                ">

                    <tr>
                        <td style="padding:16px; font-weight:bold; width:35%; background:#f9fafb;">
                            Customer Name
                        </td>

                        <td style="padding:16px;">
                            ${customerName}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:16px; font-weight:bold; background:#f9fafb;">
                            Mobile Number
                        </td>

                        <td style="padding:16px;">
                            ${mobile}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:16px; font-weight:bold; background:#f9fafb;">
                            Whatsapp Number
                        </td>

                        <td style="padding:16px;">
                            ${whatsapp}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:16px; font-weight:bold; background:#f9fafb;">
                            Sector
                        </td>

                        <td style="padding:16px;">
                            ${sector}
                        </td>
                    </tr>

                </table>


                <!-- ORDER DETAILS -->

                <h2 style="
                    margin-top:50px;
                    margin-bottom:25px;
                    color:#111827;
                    font-size:30px;
                ">
                    Order Details
                </h2>

                <table style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:18px;
                ">

                    <thead>
                        <tr style="background:#1f6980; color:white;">
                            <th style="padding:18px; text-align:left;">Item</th>
                            <th style="padding:18px; text-align:left;">Size</th>
                            <th style="padding:18px; text-align:left;">Quantity</th>
                            <th style="padding:18px; text-align:left;">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td style="padding:18px; border-bottom:1px solid #eee;">
                                ${item}
                            </td>

                            <td style="padding:18px; border-bottom:1px solid #eee;">
                                ${size}
                            </td>

                            <td style="padding:18px; border-bottom:1px solid #eee;">
                                ${quantity}
                            </td>

                            <td style="padding:18px; border-bottom:1px solid #eee; font-weight:bold; color:green;">
                                ₹ ${totalBill}
                            </td>
                        </tr>
                    </tbody>

                </table>


                <!-- PAYMENT DETAILS -->

                <div style="
                    margin-top:40px;
                    padding:25px;
                    background:#f9fafb;
                    border-radius:14px;
                ">

                    <h2 style="
                        margin-bottom:20px;
                        color:#111827;
                    ">
                        Payment Details
                    </h2>

                    <p style="margin-bottom:12px; font-size:18px;">
                        <strong>Advance Payment:</strong>
                        ₹ ${advancePayment}
                    </p>

                    <p style="font-size:18px;">
                        <strong>Description:</strong>
                        ${description}
                    </p>

                </div>

            </div>

            <!-- FOOTER -->

            <div style="
                background:#1f2937;
                color:white;
                text-align:center;
                padding:24px;
                font-size:16px;
            ">
                Vishal Digitals Invoice System
            </div>

        </div>

    </div>
    `,

    // ==========================================
    // MAIL ATTACHMENTS
    // ==========================================
    //
    // companylogo:
    // used inside invoice HTML using CID.
    //
    // ...attachments:
    // user uploaded images.
    //
};

        try {

            await transporter.sendMail(mailOptions);

            res.redirect("/success");

        } catch (error) {

            console.log(error);

            res.send("Error Sending Mail");
        }
    }
);

