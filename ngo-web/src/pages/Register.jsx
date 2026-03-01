import React, { useState } from "react";
import { toast } from "react-toastify";
import { paymentAPI } from "../utils/api";
import Input from "../components/Input";
import Button from "../components/Button1";
import Card from "../components/Card1";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastRegistration, setLastRegistration] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    city: "",
    state: "",
    collegeName: "",
    course: "",
    yearOfStudy: "",
    category: "",
  });
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "dateOfBirth" && value) {
      const birthDate = new Date(value);
      const refDate = new Date("2026-02-01");
      let age = refDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = refDate.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age: age.toString() }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Invalid 10-digit mobile number";

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";

    if (!formData.age) newErrors.age = "Age is required";
    else {
      const ageNum = Number(formData.age);
      if (ageNum < 17 || ageNum > 23)
        newErrors.age = "Age must be between 17 and 23";
    }

    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (!formData.collegeName.trim())
      newErrors.collegeName = "College/University name is required";

    if (!formData.course.trim())
      newErrors.course = "Course/Program is required";

    if (!formData.yearOfStudy)
      newErrors.yearOfStudy = "Year of study is required";

    if (!formData.category) newErrors.category = "Category is required";

    if (!declarationAccepted)
      newErrors.declaration = "You must agree to the declaration";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit fired');
    const valid = validateForm();
    console.log('validateForm result:', valid, errors);
    if (!valid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment SDK not loaded. Please refresh the page.");
      console.log('window.Razorpay:', window.Razorpay);
      return;
    }

    setLoading(true);

    try {
      const registrationPayload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
        collegeName: formData.collegeName,
        course: formData.course,
        yearOfStudy: formData.yearOfStudy,
        category: formData.category,
        declarationAccepted,
      };

      const orderRes = await paymentAPI.createOrder(registrationPayload);
      const orderData = orderRes.data;

      if (!orderData.success) {
        toast.error(orderData.message || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      const { key, orderId, amount, currency, registration } = orderData;

      const options = {
        key,
        amount,
        currency,
        name: "SNPC 2026 Photo Contest",
        description: "Registration Fee",
        order_id: orderId,
        prefill: {
          name: registration.fullName,
          email: registration.email,
          contact: registration.phone,
        },
        notes: {
          category: registration.category,
          collegeName: registration.collegeName,
        },
        theme: { color: "#4a7c29" },
        handler: async function (response) {
          try {
            const verifyRes = await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registration: registrationPayload,
            });

            if (verifyRes.data.success) {
              const { participantId, participant } = verifyRes.data;

              toast.success(
                `Registration successful! Your ID: ${participantId}`
              );

              setLastRegistration({
                participantId,
                fullName: participant.full_name || registration.fullName,
                email: participant.email || registration.email,
                category: participant.category || registration.category,
                registrationDate: participant.registration_date,
              });
              setShowSuccessModal(true);

              setFormData({
                fullName: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                age: "",
                gender: "",
                city: "",
                state: "",
                collegeName: "",
                course: "",
                yearOfStudy: "",
                category: "",
              });
              setDeclarationAccepted(false);
              setErrors({});
            } else {
              toast.error(
                verifyRes.data.message || "Payment verification failed"
              );
            }
          } catch (err) {
            console.error("Verify payment error:", err);
            toast.error(err.message || "Failed to verify payment");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment popup closed. Registration not completed.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Registration/payment init error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
      setLoading(false);
    }
  };
console.log('Register loading state:', loading);
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      <div className="py-12 px-4">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-10 animate-slide-down">
            <h1 className="text-4xl md:text-5xl font-extrabold text-forest mb-3">
              Register for SNPC 2026
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Swadhyay National Photography Competition · Nature & Wildlife
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs md:text-sm">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-amber-100">
                Registration: 10 Feb – 15 Apr 2026
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">
                Fee: ₹100 · Non‑refundable
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-100">
                 Total Prizes: ₹43,000 + E‑Certificates
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto animate-slide-up">
            <Card className="shadow-lg border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Info strip */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    Important Information
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>✓ Registration fee: ₹100 (non‑refundable)</li>
                    <li>✓ Age limit: 17–23 years (as on 1 February 2026)</li>
                    <li>✓ Registration deadline: 15 April 2026</li>
                    <li>✓ Submission deadline: 23 April 2026</li>
                  </ul>
                </div>

                {/* SECTION 1 */}
                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-1">
                    SECTION 1 · Participant Details
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Please provide your personal information. All details must
                    match your official college/university records.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      error={errors.fullName}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      error={errors.email}
                      required
                    />
                    <Input
                      label="Mobile Number (WhatsApp preferred)"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      error={errors.phone}
                      maxLength="10"
                      required
                    />
                    <Input
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      error={errors.dateOfBirth}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                    <Input
                      label="Age (as on 1 February 2026)"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="17–23 years"
                      error={errors.age}
                      readOnly
                      helperText="Auto‑calculated from date of birth"
                    />
                  </div>

                  {/* Gender */}
                  <div className="mt-5">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">
                      Gender <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {["Male", "Female", "Other", "Prefer not to say"].map(
                        (opt) => (
                          <label
                            key={opt}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 hover:border-primary/60 cursor-pointer bg-white"
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={opt}
                              checked={formData.gender === opt}
                              onChange={handleChange}
                              className="text-primary focus:ring-primary"
                            />
                            <span>{opt}</span>
                          </label>
                        )
                      )}
                    </div>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  {/* City / State */}
                  <div className="grid md:grid-cols-2 gap-4 mt-5">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      error={errors.city}
                      required
                    />

                    <div>
                      <label className="block mb-2 font-semibold text-gray-700 text-sm">
                        State <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
                          📍
                        </span>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 pl-12 border-2 rounded-lg text-base transition-all outline-none ${
                            errors.state
                              ? "border-red-500"
                              : "border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
                          }`}
                        >
                          <option value="">Select State</option>
                          {/* states + UTs as in your current code */}
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Arunachal Pradesh">
                            Arunachal Pradesh
                          </option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">
                            Himachal Pradesh
                          </option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Madhya Pradesh">
                            Madhya Pradesh
                          </option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                          <option value="Andaman and Nicobar Islands">
                            Andaman and Nicobar Islands
                          </option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Dadra and Nagar Haveli and Daman and Diu">
                            Dadra and Nagar Haveli and Daman and Diu
                          </option>
                          <option value="Delhi">Delhi</option>
                          <option value="Jammu and Kashmir">
                            Jammu and Kashmir
                          </option>
                          <option value="Ladakh">Ladakh</option>
                          <option value="Lakshadweep">Lakshadweep</option>
                          <option value="Puducherry">Puducherry</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      {errors.state && (
                        <span className="block mt-2 text-sm text-red-500">
                          {errors.state}
                        </span>
                      )}
                    </div>
                  </div>
                </section>

                {/* SECTION 2 */}
                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-2">
                    SECTION 2 · Educational Details
                  </h2>
                  <p className="text-sm text-gray-600 mb-5">
                    This competition is open only to college and university
                    students. Please provide accurate academic details.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Name of College/University"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        placeholder="Enter your college or university name"
                        error={errors.collegeName}
                        required
                      />
                    </div>
                    <Input
                      label="Course / Program"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="e.g., B.Sc. Zoology, B.Tech CSE, B.Com"
                      error={errors.course}
                      required
                    />
                  </div>

                  <div className="mt-5">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">
                      Year of Study <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid sm:grid-cols-3 gap-2 text-sm">
                      {[
                        "1st Year",
                        "2nd Year",
                        "3rd Year",
                        "4th Year",
                        "5th Year",
                        "Postgraduate",
                      ].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                            formData.yearOfStudy === opt
                              ? "border-primary bg-primary/5"
                              : "border-gray-300 hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="yearOfStudy"
                            value={opt}
                            checked={formData.yearOfStudy === opt}
                            onChange={handleChange}
                            className="text-primary focus:ring-primary"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors.yearOfStudy && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.yearOfStudy}
                      </p>
                    )}
                  </div>
                </section>

                {/* SECTION 3 */}
                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-2">
                    SECTION 3 · Competition Category
                  </h2>
                  <p className="text-sm text-gray-600 mb-5">
                    Select the category under which you intend to submit your photograph.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Nature */}
                    <label
                      className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.category === "nature"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-300 hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value="nature"                      // lowercase
                        checked={formData.category === "nature"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">Nature</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Landscapes, forests, mountains, rivers
                        </p>
                      </div>
                      {formData.category === "nature" && (
                        <div className="absolute top-4 right-4 text-primary text-2xl">
                          ✓
                        </div>
                      )}
                    </label>

                    {/* Wildlife */}
                    <label
                      className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.category === "wildlife"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-300 hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value="wildlife"                   // lowercase
                        checked={formData.category === "wildlife"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">Wildlife</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Animals, birds, insects in natural habitat
                        </p>
                      </div>
                      {formData.category === "wildlife" && (
                        <div className="absolute top-4 right-4 text-primary text-2xl">
                          ✓
                        </div>
                      )}
                    </label>
                  </div>

                  {errors.category && (
                    <span className="block mt-2 text-sm text-red-500">
                      {errors.category}
                    </span>
                  )}
                </section>


                {/* SECTION 4 */}
                <section>
                  <h2 className="text-lg md:text-xl font-bold text-forest mb-2">
                    SECTION 4 · Declaration & Consent
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Please read the declaration carefully before submitting the
                    form.
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                    <p>I hereby declare that:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        I am between 17 and 23 years of age and currently a
                        college/university student.
                      </li>
                      <li>
                        All information provided by me is true and correct.
                      </li>
                      <li>
                        I have read and understood the competition rules and
                        agree to abide by them.
                      </li>
                      <li>The photograph submitted will be my original work.</li>
                      <li>
                        I grant permission to the organizers to use my
                        photograph for promotional, educational, and exhibition
                        purposes with due credit.
                      </li>
                    </ul>
                  </div>

                  <label className="mt-3 inline-flex items-start gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={(e) => setDeclarationAccepted(e.target.checked)}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <span>I agree to the above declaration</span>
                  </label>
                  {errors.declaration && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.declaration}
                    </p>
                  )}
                </section>

                {/* Submit */}
                <div className="pt-2 border-t border-slate-100">
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Proceed to Payment (₹100)"}
                  </Button>
                  <p className="text-center text-xs md:text-sm text-gray-500 mt-3">
                    By registering, you agree to the competition rules and
                    guidelines.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && lastRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-forest mb-3">
              Registration Successful 🎉
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Please save your Participant ID carefully. You will need it for
              photo submission and future communication.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 space-y-1 mb-4">
              <p>
                <span className="font-semibold">Participant ID:</span>{" "}
                {lastRegistration.participantId}
              </p>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {lastRegistration.fullName}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {lastRegistration.email}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {lastRegistration.category}
              </p>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              <span className="font-semibold">Check your Email for more details.</span>
            </p>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
