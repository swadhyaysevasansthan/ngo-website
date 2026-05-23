import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { schoolRegistrationAPI } from '../utils/api';

import Input from '../components/Input';
import Button from '../components/Button1';
import Card from '../components/Card1';

const INDIAN_DATES = {
  min: '2026-05-01',
  max: '2027-02-28',
};

const PaintingRegistrationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const [school, setSchool] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    competitionCategories: [],

    // PRIMARY
    primaryTeacher1Name: '',
    primaryTeacher1Email: '',
    primaryTeacher1Phone: '',
    primaryTeacher1Designation: '',

    primaryTeacher2Name: '',
    primaryTeacher2Email: '',
    primaryTeacher2Phone: '',
    primaryTeacher2Designation: '',

    // SECONDARY
    secondaryTeacher1Name: '',
    secondaryTeacher1Email: '',
    secondaryTeacher1Phone: '',
    secondaryTeacher1Designation: '',

    secondaryTeacher2Name: '',
    secondaryTeacher2Email: '',
    secondaryTeacher2Phone: '',
    secondaryTeacher2Designation: '',

    // CLASS COUNTS
    class3: '',
    class4: '',
    class5: '',

    class6: '',
    class7: '',
    class8: '',

    // PRIMARY DATES
    primaryDate1: '',
    primaryDate2: '',
    primaryDate3: '',
    primaryDate4: '',

    // SECONDARY DATES
    secondaryDate1: '',
    secondaryDate2: '',
    secondaryDate3: '',
    secondaryDate4: '',
  });

  useEffect(() => {
    if (!token) {
      setTokenError(
        'Missing token. Please use the link sent to your school email.'
      );

      setTokenLoading(false);

      return;
    }

    schoolRegistrationAPI
      .validateToken(token)

      .then((res) => {
        const { school, registrations } = res.data.data;

        if (registrations.painting) {
          setTokenError(
            'Your school has already registered for the painting competition.'
          );

          return;
        }

        setSchool(school);
      })

      .catch((err) => {
        setTokenError(
          err.response?.data?.message ||
            'Invalid or expired registration link.'
        );
      })

      .finally(() => {
        setTokenLoading(false);
      });
  }, [token]);

  const getNum = (v) =>
    parseInt(v, 10) || 0;

  const primaryCategoryTotal =
    getNum(formData.class3) +
    getNum(formData.class4) +
    getNum(formData.class5);

  const secondaryCategoryTotal =
    getNum(formData.class6) +
    getNum(formData.class7) +
    getNum(formData.class8);

  const totalParticipants =
    primaryCategoryTotal +
    secondaryCategoryTotal;

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCategoryChange = (
    category
  ) => {
    setFormData((prev) => {
      if (
        prev.competitionCategories.includes(
          category
        )
      ) {
        return {
          ...prev,

          competitionCategories:
            prev.competitionCategories.filter(
              (c) => c !== category
            ),
        };
      }

      return {
        ...prev,

        competitionCategories: [
          ...prev.competitionCategories,
          category,
        ],
      };
    });
  };

  const validateUniqueTeachers = (teachers) => {

    const errors = {};

    const names = new Map();

    const emails = new Map();

    const phones = new Map();

    teachers.forEach((teacher) => {

      const name =
        teacher.name
          ?.trim()
          .toLowerCase();

      const email =
        teacher.email
          ?.trim()
          .toLowerCase();

      const phone =
        teacher.phone?.trim();

      // NAME

      if (name) {

        if (names.has(name)) {

          errors[
            teacher.nameField
          ] =
            'Duplicate teacher name';

          errors[
            names.get(name)
          ] =
            'Duplicate teacher name';

        } else {

          names.set(
            name,
            teacher.nameField
          );
        }
      }

      // EMAIL

      if (email) {

        if (emails.has(email)) {

          errors[
            teacher.emailField
          ] =
            'Duplicate teacher email';

          errors[
            emails.get(email)
          ] =
            'Duplicate teacher email';

        } else {

          emails.set(
            email,
            teacher.emailField
          );
        }
      }

      // PHONE

      if (phone) {

        if (phones.has(phone)) {

          errors[
            teacher.phoneField
          ] =
            'Duplicate teacher phone';

          errors[
            phones.get(phone)
          ] =
            'Duplicate teacher phone';

        } else {

          phones.set(
            phone,
            teacher.phoneField
          );
        }
      }
    });

    return errors;
  };

  const validate = () => {
    const e = {};

    if (
      formData.competitionCategories
        .length === 0
    ) {
      e.categories =
        'Please select at least one category';
    }

    const emailRegex =
      /\S+@\S+\.\S+/;

    const phoneRegex =
      /^[6-9]\d{9}$/;

    const validateTeacherFields = (
      prefix
    ) => {
      if (
        !formData[
          `${prefix}Name`
        ].trim()
      ) {
        e[
          `${prefix}Name`
        ] =
          'Teacher name is required';
      }

      if (
        !formData[
          `${prefix}Email`
        ].trim()
      ) {
        e[
          `${prefix}Email`
        ] =
          'Teacher email is required';

      } else if (
        !emailRegex.test(
          formData[
            `${prefix}Email`
          ]
        )
      ) {
        e[
          `${prefix}Email`
        ] = 'Invalid email';
      }

      if (
        !formData[
          `${prefix}Phone`
        ].trim()
      ) {
        e[
          `${prefix}Phone`
        ] =
          'Teacher phone is required';

      } else if (
        !phoneRegex.test(
          formData[
            `${prefix}Phone`
          ]
        )
      ) {
        e[
          `${prefix}Phone`
        ] =
          'Invalid 10-digit number';
      }

      if (
        !formData[
          `${prefix}Designation`
        ].trim()
      ) {
        e[
          `${prefix}Designation`
        ] =
          'Designation required';
      }
    };

    // PRIMARY
    if (
      formData.competitionCategories.includes(
        'primary'
      )
    ) {
      validateTeacherFields(
        'primaryTeacher1'
      );

      validateTeacherFields(
        'primaryTeacher2'
      );

      ['class3', 'class4', 'class5'].forEach(
        (field) => {
          const val =
            getNum(
              formData[field]
            );

          if (val < 0) {
            e[field] =
              'Cannot be negative';
          }
        }
      );

      if (
        primaryCategoryTotal === 0
      ) {
        e.class3 =
          'Please enter at least 1 participant in primary category';
      }

      if (
        primaryCategoryTotal > 150
      ) {
        e.class3 =
          'Primary category total cannot exceed 150 participants';
      }

      [
        'primaryDate1',
        'primaryDate2',
        'primaryDate3',
        'primaryDate4',
      ].forEach((key, i) => {
        if (!formData[key]) {
          e[key] =
            `Preferred date ${i + 1} is required`;
        }
      });

      const dates = [
        formData.primaryDate1,
        formData.primaryDate2,
        formData.primaryDate3,
        formData.primaryDate4,
      ];

      if (
        new Set(
          dates.filter(Boolean)
        ).size !==
        dates.filter(Boolean).length
      ) {
        e.primaryDate1 =
          'All preferred dates must be different';
      }
    }

    // SECONDARY
    if (
      formData.competitionCategories.includes(
        'secondary'
      )
    ) {
      validateTeacherFields(
        'secondaryTeacher1'
      );

      validateTeacherFields(
        'secondaryTeacher2'
      );

      ['class6', 'class7', 'class8'].forEach(
        (field) => {
          const val =
            getNum(
              formData[field]
            );

          if (val < 0) {
            e[field] =
              'Cannot be negative';
          }
        }
      );

      if (
        secondaryCategoryTotal === 0
      ) {
        e.class6 =
          'Please enter at least 1 participant in secondary category';
      }

      if (
        secondaryCategoryTotal > 150
      ) {
        e.class6 =
          'Secondary category total cannot exceed 150 participants';
      }

      [
        'secondaryDate1',
        'secondaryDate2',
        'secondaryDate3',
        'secondaryDate4',
      ].forEach((key, i) => {
        if (!formData[key]) {
          e[key] =
            `Preferred date ${i + 1} is required`;
        }
      });

      const dates = [
        formData.secondaryDate1,
        formData.secondaryDate2,
        formData.secondaryDate3,
        formData.secondaryDate4,
      ];

      if (
        new Set(
          dates.filter(Boolean)
        ).size !==
        dates.filter(Boolean).length
      ) {
        e.secondaryDate1 =
          'All preferred dates must be different';
      }
    }

    if (
      totalParticipants > 300
    ) {
      e.class3 =
        'Total participants across both categories cannot exceed 300';
    }

    setErrors(e);

    return (
      Object.keys(e).length === 0
    );
  };

  const renderInput = (
    label,
    name,
    type = 'text',
    extraProps = {}
  ) => (
    <Input
      label={label}
      name={name}
      type={type}
      value={formData[name]}
      onChange={handleChange}
      error={errors[name]}
      {...extraProps}
    />
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error(
        'Please fix the errors in the form'
      );

      return;
    }

    setLoading(true);

    try {
      const teachers = [];

      if (
        formData.competitionCategories.includes(
          'primary'
        )
      ) {
        teachers.push(
          {
            category: 'primary',
            role: 'coordinator',

            name:
              formData.primaryTeacher1Name,

            email:
              formData.primaryTeacher1Email,

            phone:
              formData.primaryTeacher1Phone,

            designation:
              formData.primaryTeacher1Designation,

            nameField:
              'primaryTeacher1Name',

            emailField:
              'primaryTeacher1Email',

            phoneField:
              'primaryTeacher1Phone',
          },

          {
            category: 'primary',
            role: 'coordinator',

            name:
              formData.primaryTeacher2Name,

            email:
              formData.primaryTeacher2Email,

            phone:
              formData.primaryTeacher2Phone,

            designation:
              formData.primaryTeacher2Designation,

            nameField:
              'primaryTeacher2Name',

            emailField:
              'primaryTeacher2Email',

            phoneField:
              'primaryTeacher2Phone',
          }
        );
      }

      if (
        formData.competitionCategories.includes(
          'secondary'
        )
      ) {
        teachers.push(
          {
            category: 'secondary',
            role: 'coordinator',

            name:
              formData.secondaryTeacher1Name,

            email:
              formData.secondaryTeacher1Email,

            phone:
              formData.secondaryTeacher1Phone,

            designation:
              formData.secondaryTeacher1Designation,
            
            nameField:
              'secondaryTeacher1Name',

            emailField:
              'secondaryTeacher1Email',

            phoneField:
              'secondaryTeacher1Phone',
          },

          {
            category: 'secondary',
            role: 'coordinator',

            name:
              formData.secondaryTeacher2Name,

            email:
              formData.secondaryTeacher2Email,

            phone:
              formData.secondaryTeacher2Phone,

            designation:
              formData.secondaryTeacher2Designation,

            nameField:
              'secondaryTeacher2Name',

            emailField:
              'secondaryTeacher2Email',

            phoneField:
              'secondaryTeacher2Phone',
          }
        );
      }

      const duplicateErrors =
        validateUniqueTeachers(
          teachers
        );

      if (
        Object.keys(
          duplicateErrors
        ).length > 0
      ) {

        setErrors((prev) => ({
          ...prev,
          ...duplicateErrors,
        }));

        toast.error(
          'Duplicate teacher details found.'
        );

        setLoading(false);

        return;
      }

      await schoolRegistrationAPI.submitPainting(
        token,
        {
          competitionCategories:
            formData.competitionCategories,

          teachers,

          classCounts: {
            3: getNum(
              formData.class3
            ),

            4: getNum(
              formData.class4
            ),

            5: getNum(
              formData.class5
            ),

            6: getNum(
              formData.class6
            ),

            7: getNum(
              formData.class7
            ),

            8: getNum(
              formData.class8
            ),
          },

          primaryCategoryTotal,
          secondaryCategoryTotal,
          totalParticipants,

          primaryPreferredDates:
            formData.competitionCategories.includes(
              'primary'
            )
              ? [
                  formData.primaryDate1,
                  formData.primaryDate2,
                  formData.primaryDate3,
                  formData.primaryDate4,
                ]
              : [],

          secondaryPreferredDates:
            formData.competitionCategories.includes(
              'secondary'
            )
              ? [
                  formData.secondaryDate1,
                  formData.secondaryDate2,
                  formData.secondaryDate3,
                  formData.secondaryDate4,
                ]
              : [],
        }
      );

      toast.success(
        'Painting competition registration submitted successfully!'
      );

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cannot Continue
          </h2>

          <p className="text-gray-600 mb-6">
            {tokenError}
          </p>

          <Button
            onClick={() =>
              navigate(
                `/school-registration?token=${token}`
              )
            }
          >
            Back to Registration Home
          </Button>

        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 py-16">

        <div className="max-w-lg w-full text-center animate-slide-down">

          <div className="text-7xl mb-6">
            🎨
          </div>

          <h1 className="text-3xl font-extrabold text-forest mb-3">
            Painting Registration Confirmed!
          </h1>

          <p className="text-gray-600 mb-6">
            Your school's painting competition registration has been submitted successfully.
          </p>

          <Button
            onClick={() =>
              navigate(
                `/school-registration?token=${token}`
              )
            }
          >
            Back to Registration Home
          </Button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-50">

      <div className="py-12 px-4">

        <div className="container-custom">

          <div className="text-center mb-8 animate-slide-down">

            <h1 className="text-3xl md:text-4xl font-extrabold text-forest mb-2">
              🎨 Painting Competition Registration
            </h1>

            <p className="text-gray-600">
              {school?.schoolName}
            </p>

          </div>

          <div className="max-w-5xl mx-auto animate-slide-up">

            <Card className="shadow-lg border border-slate-100">

              <form
                onSubmit={handleSubmit}
                className="space-y-10"
              >

                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 text-sm text-gray-700">

                  <ul className="space-y-1">

                    <li>
                      ✓ Primary Category (Classes 3–5):
                      Maximum 150 students
                    </li>

                    <li>
                      ✓ Secondary Category (Classes 6–8):
                      Maximum 150 students
                    </li>

                    <li>
                      ✓ Schools may participate in one or both categories.
                    </li>

                    <li>
                      ✓ Provide 4 preferred dates separately for each category.
                    </li>

                  </ul>
                </div>

                {/* CATEGORY */}

                <section>

                  <h2 className="text-lg md:text-xl font-bold text-forest mb-4">
                    SECTION · Competition Categories
                  </h2>

                  <div className="space-y-4">

                    <label className="flex items-center gap-3">

                      <input
                        type="checkbox"

                        checked={formData.competitionCategories.includes(
                          'primary'
                        )}

                        onChange={() =>
                          handleCategoryChange(
                            'primary'
                          )
                        }
                      />

                      <span>
                        Primary Category (Classes 3rd–5th)
                      </span>

                    </label>

                    <label className="flex items-center gap-3">

                      <input
                        type="checkbox"

                        checked={formData.competitionCategories.includes(
                          'secondary'
                        )}

                        onChange={() =>
                          handleCategoryChange(
                            'secondary'
                          )
                        }
                      />

                      <span>
                        Secondary Category (Classes 6th–8th)
                      </span>

                    </label>

                  </div>

                  {errors.categories && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.categories}
                    </p>
                  )}

                </section>

                                {/* PRIMARY */}

                {formData.competitionCategories.includes(
                  'primary'
                ) && (

                  <section className="space-y-8">

                    <h2 className="text-lg md:text-xl font-bold text-blue-700">
                      SECTION · Primary Category Teachers
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                      {renderInput(
                        'Primary Teacher 1 Name',
                        'primaryTeacher1Name'
                      )}

                      {renderInput(
                        'Primary Teacher 1 Email',
                        'primaryTeacher1Email',
                        'email'
                      )}

                      {renderInput(
                        'Primary Teacher 1 Phone',
                        'primaryTeacher1Phone'
                      )}

                      {renderInput(
                        'Primary Teacher 1 Designation',
                        'primaryTeacher1Designation'
                      )}

                      {renderInput(
                        'Primary Teacher 2 Name',
                        'primaryTeacher2Name'
                      )}

                      {renderInput(
                        'Primary Teacher 2 Email',
                        'primaryTeacher2Email',
                        'email'
                      )}

                      {renderInput(
                        'Primary Teacher 2 Phone',
                        'primaryTeacher2Phone'
                      )}

                      {renderInput(
                        'Primary Teacher 2 Designation',
                        'primaryTeacher2Designation'
                      )}

                    </div>

                    <div>

                      <h3 className="text-base font-semibold text-gray-800 mb-4">
                        Primary Category Student Counts
                      </h3>

                      <div className="grid md:grid-cols-3 gap-5">

                        {renderInput(
                          'Class 3 Students',
                          'class3',
                          'number'
                        )}

                        {renderInput(
                          'Class 4 Students',
                          'class4',
                          'number'
                        )}

                        {renderInput(
                          'Class 5 Students',
                          'class5',
                          'number'
                        )}

                      </div>

                      <div
                        className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          primaryCategoryTotal > 150
                            ? 'bg-red-100 text-red-700'
                            : primaryCategoryTotal > 0
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        Primary Total:
                        {' '}
                        {primaryCategoryTotal}

                        {primaryCategoryTotal > 150 &&
                          ' — exceeds limit of 150'}
                      </div>

                    </div>

                    <div>

                      <h3 className="text-base font-semibold text-gray-800 mb-4">
                        Preferred Dates for Primary Category
                      </h3>

                      <div className="grid md:grid-cols-2 gap-5">

                        {renderInput(
                          'Preferred Date 1',
                          'primaryDate1',
                          'date',
                          {
                            min: INDIAN_DATES.min,
                            max: INDIAN_DATES.max,
                          }
                        )}

                        {renderInput(
                          'Preferred Date 2',
                          'primaryDate2',
                          'date',
                          {
                            min: INDIAN_DATES.min,
                            max: INDIAN_DATES.max,
                          }
                        )}

                        {renderInput(
                          'Preferred Date 3',
                          'primaryDate3',
                          'date',
                          {
                            min: INDIAN_DATES.min,
                            max: INDIAN_DATES.max,
                          }
                        )}

                        {renderInput(
                          'Preferred Date 4',
                          'primaryDate4',
                          'date',
                          {
                            min: INDIAN_DATES.min,
                            max: INDIAN_DATES.max,
                          }
                        )}

                      </div>

                    </div>

                  </section>
                )}

                {/* SECONDARY */}

                {formData.competitionCategories.includes(
                  'secondary'
                ) && (

                  <section className="space-y-8">

                    <h2 className="text-lg md:text-xl font-bold text-purple-700">
                      SECTION · Secondary Category Teachers
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                      {renderInput(
                        'Secondary Teacher 1 Name',
                        'secondaryTeacher1Name'
                      )}

                      {renderInput(
                        'Secondary Teacher 1 Email',
                        'secondaryTeacher1Email',
                        'email'
                      )}

                      {renderInput(
                        'Secondary Teacher 1 Phone',
                        'secondaryTeacher1Phone'
                      )}

                      {renderInput(
                        'Secondary Teacher 1 Designation',
                        'secondaryTeacher1Designation'
                      )}

                      {renderInput(
                        'Secondary Teacher 2 Name',
                        'secondaryTeacher2Name'
                      )}

                      {renderInput(
                        'Secondary Teacher 2 Email',
                        'secondaryTeacher2Email',
                        'email'
                      )}

                      {renderInput(
                        'Secondary Teacher 2 Phone',
                        'secondaryTeacher2Phone'
                      )}

                      {renderInput(
                        'Secondary Teacher 2 Designation',
                        'secondaryTeacher2Designation'
                      )}

                    </div>

                    <div>

                      <h3 className="text-base font-semibold text-gray-800 mb-4">
                        Secondary Category Student Counts
                      </h3>

                      <div className="grid md:grid-cols-3 gap-5">

                        {renderInput(
                          'Class 6 Students',
                          'class6',
                          'number'
                        )}

                        {renderInput(
                          'Class 7 Students',
                          'class7',
                          'number'
                        )}

                        {renderInput(
                          'Class 8 Students',
                          'class8',
                          'number'
                        )}

                      </div>

                      <div
                        className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          secondaryCategoryTotal > 150
                            ? 'bg-red-100 text-red-700'
                            : secondaryCategoryTotal > 0
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        Secondary Total:
                        {' '}
                        {secondaryCategoryTotal}

                        {secondaryCategoryTotal > 150 &&
                          ' — exceeds limit of 150'}
                      </div>

                    </div>

                    <div>

                      <h3 className="text-base font-semibold text-gray-800 mb-4">
                        Preferred Dates for Secondary Category
                      </h3>

                      <div className="grid md:grid-cols-2 gap-5">

                        {renderInput(
                          'Preferred Date 1',
                          'secondaryDate1',
                          'date',
                          {
                            min: INDIAN_DATES.min,
                            max: INDIAN_DATES.max,
                          }
                        )}

                        {renderInput(
                          'Preferred Date 2',
                          'secondaryDate2',
                          'date',
                          {
                            min: INDIAN_DATES.min,
                            max: INDIAN_DATES.max,
                          }
                        )}

                        {renderInput(
                          'Preferred Date 3',
                          'secondaryDate3',
                          'date',
                          {
                            min: INDIAN_DATES.min,
                            max: INDIAN_DATES.max,
                          }
                        )}

                        {renderInput(
                          'Preferred Date 4',
                          'secondaryDate4',
                          'date',
                          {
                            min: INDIAN_DATES.min,
                            max: INDIAN_DATES.max,
                          }
                        )}

                      </div>

                    </div>

                  </section>
                )}

                {/* TOTALS */}

                <section>

                  <h2 className="text-lg md:text-xl font-bold text-forest mb-4">
                    SECTION · Final Totals
                  </h2>

                  <div
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold ${
                      totalParticipants > 300
                        ? 'bg-red-100 text-red-700'
                        : totalParticipants > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    Total Participants Across Categories:
                    {' '}
                    {totalParticipants}

                    {totalParticipants > 300 &&
                      ' — exceeds maximum limit of 300'}
                  </div>

                </section>

                {/* SUBMIT */}

                <div className="pt-4">

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading
                      ? 'Submitting Registration...'
                      : 'Submit Painting Registration'}
                  </Button>

                </div>

              </form>

            </Card>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PaintingRegistrationForm;