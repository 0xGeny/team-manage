/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import axios from 'axios'
import swal from "sweetalert";

//import '../../assets/sass/style.scss'
//import '../../assets/sass/style.react.scss'
//import {toAbsoluteUrl} from '../../../../_metronic/helpers'

const initialValues = {
  username: '',
  role: '',
  group: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
}

const groupdata = [];
const groupdatalength = 0;

const registrationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Username is required'),
  role: Yup.string()
    .max(1, 'Maximum 1 symbol')
    .required('Role is required'),
  ip_address: Yup.string()
    .required('IP address is required'),
  mac_address: Yup.string()
    .required('MAC address is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export default function Registration() {
  const [loading, setLoading] = useState(false)
  // const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(false)
    },
  })
  const [username, setState] = useState('');
  const [role, setState1] = useState('');
  const [group, setState2] = useState('');
  const [password, setState3] = useState('');
  const [ip_address, setState4] = useState('');
  const [mac_address, setState5] = useState('');

  const onChange = (e) => { setState(e.target.value); }
  const onChange1 = (e) => { setState1(e.target.value); }
  const onChange2 = (e) => { setState2(e.target.value); }
  const onChange3 = (e) => { setState3(e.target.value); }
  const onChange4 = (e) => { setState4(e.target.value); }
  const onChange5 = (e) => { setState5(e.target.value); }
  useEffect(() => {
    // if (localStorage.getItem("token")) {
    //   if (localStorage.getItem("token").split(" ")[0] === "Frog") {
    axios.post("http://192.168.40.33:7150/auth/", { token: localStorage.getItem("token") })
      .then((res) => {

        // Clear the options 

        // Add new options 
        axios.post("http://192.168.40.33:7150/getGroup_L/", { name: username })
          .then((res) => {
            let temp1 = JSON.parse(res.data.group);
            for (let i = 0; i < temp1.length; i++) {
              groupdata.pop(groupdata[i]);
            }
            for (let i = 0; i < temp1.length; i++) {
              groupdata.push({ name: temp1[i].name })
            }
            const select = document.getElementById("group_select");
            select.options.length = 0;
            for (let i = 0; i < temp1.length; i++) {
              select.options[i] = new Option(groupdata[i].name, groupdata[i].name);
            }
            setState2(groupdata[0].name);
          }).catch((error) => {
            error = new Error();
          });
        if (res.data.message === "success_auth") {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        error = new Error();
      });
    //   }
    // }
  }, []);

  
  const handleClickS = () => {
    const select = document.getElementById("group_select");
    select.options.length = groupdata.length;
  }
  const handleClick = () => {
    axios.post("http://192.168.40.33:7150/signup/", {
      username: username, role: role, group: group, password: password, ip_address: ip_address, mac_address: mac_address
    }).then((res) => {
      if (res.data.message === "User is already registerd") {
        swal({
          text: res.data.message,
          icon: "error",
          type: "error"
        })
      }
      else {
        swal({
          text: res.data.message,
          icon: "success",
          type: "success"
        })
      }
    })
  }
  let [group_d, setGroup] = useState(groupdata);

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        // backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
      }}
    >
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        <a href='#' className='mb-12'>
          {/* <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-1.svg')} className='h-45px' /> */}
        </a>
        {/* end::Logo */}
        {/* begin::Wrapper */}
        <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>



          <form
            className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
            noValidate
            id='kt_login_signup_form'
            onSubmit={formik.handleSubmit}
          >
            {/* begin::Heading */}
            <div className='mb-10 text-center'>
              {/* begin::Title */}
              <h1 className='text-dark mb-3'>Create an Account</h1>
              {/* end::Title */}

              {/* begin::Link */}
              <div className='text-gray-400 fw-bold fs-4'>
                Already have an account?
                <Link to='/login' className='link-primary fw-bolder' style={{ marginLeft: '5px' }}>
                  Login ?
                </Link>
              </div>
              {/* end::Link */}
            </div>
            {/* end::Heading */}

            {/* begin::Action */}

            {/* end::Action */}


            {formik.status && (
              <div className='mb-lg-15 alert alert-danger'>
                <div className='alert-text font-weight-bold'>{formik.status}</div>
              </div>
            )}

            {/* begin::Form group Firstname */}
            <div className='row fv-row mb-7'>
              <div className='col-xl-12'>
                <label className='class="form-label fw-bolder text-dark fs-6'>Username</label>
                <input
                  placeholder='Username'
                  type='text'
                  autoComplete='off'
                  onChangeCapture={onChange}
                  value={username}
                  name="username"
                  {...formik.getFieldProps('username')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {
                      'is-invalid': formik.touched.username && formik.errors.username,
                    },
                    {
                      'is-valid': formik.touched.username && !formik.errors.username,
                    }
                  )}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span style={{ color: 'black' }} role='alert'>{formik.errors.username}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group Email */}

            <div className='row fv-row mb-7'>
              <div className='col-xl-6'>
                <label className='form-label fw-bolder text-dark fs-6'>Role</label>
                <input
                  placeholder='Role'
                  type='role'
                  autoComplete='off'
                  onChangeCapture={onChange1}
                  value={role}
                  name="role"
                  {...formik.getFieldProps('role')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {
                      'is-invalid': formik.touched.role && formik.errors.role,
                    },
                    {
                      'is-valid': formik.touched.role && !formik.errors.role,
                    }
                  )}
                />
                {formik.touched.role && formik.errors.role && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span style={{ color: 'black' }} role='alert'>{formik.errors.role}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className='col-xl-6'>
                <label className='form-label fw-bolder text-dark fs-6'>Group</label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  defaultValue={'1'}
                  id="group_select"
                  onChange={onChange2}
                  onClick={handleClickS}
                >
                  {
                    groupdata.map(({ name }) => (
                      <option value={name}>{name}</option>
                    ))
                  }
                </select>
              </div>
            </div>


            <div className='row fv-row mb-7'>
              <div className='col-xl-12'>
                <label className='class="form-label fw-bolder text-dark fs-6'>IP Address</label>
                <input
                  placeholder='IP Address'
                  type='text'
                  autoComplete='off'
                  onChangeCapture={onChange4}
                  value={ip_address}
                  name="ip_address"
                  {...formik.getFieldProps('ip_address')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {
                      'is-invalid': formik.touched.ip_address && formik.errors.ip_address,
                    },
                    {
                      'is-valid': formik.touched.ip_address && !formik.errors.ip_address,
                    }
                  )}
                />
                {formik.touched.ip_address && formik.errors.ip_address && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span style={{ color: 'black' }} role='alert'>{formik.errors.ip_address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='row fv-row mb-7'>
              <div className='col-xl-12'>
                <label className='class="form-label fw-bolder text-dark fs-6'>MAC Address</label>
                <input
                  placeholder='MAC Address'
                  type='text'
                  autoComplete='off'
                  onChangeCapture={onChange5}
                  value={mac_address}
                  name="mac_address"
                  {...formik.getFieldProps('mac_address')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {
                      'is-invalid': formik.touched.mac_address && formik.errors.mac_address,
                    },
                    {
                      'is-valid': formik.touched.mac_address && !formik.errors.mac_address,
                    }
                  )}
                />
                {formik.touched.mac_address && formik.errors.mac_address && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span style={{ color: 'black' }} role='alert'>{formik.errors.mac_address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group Password */}
            <div className='mb-10 fv-row' data-kt-password-meter='true'>
              <div className='mb-1'>
                <label className='form-label fw-bolder text-dark fs-6'>Password</label>
                <div className='position-relative mb-3'>
                  <input
                    type='password'
                    placeholder='Password'
                    autoComplete='off'
                    onChangeCapture={onChange3}
                    value={password}
                    name="password"
                    {...formik.getFieldProps('password')}
                    className={clsx(
                      'form-control form-control-lg form-control-solid',
                      {
                        'is-invalid': formik.touched.password && formik.errors.password,
                      },
                      {
                        'is-valid': formik.touched.password && !formik.errors.password,
                      }
                    )}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        <span style={{ color: 'black' }} role='alert'>{formik.errors.password}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className='fv-row mb-10'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='kt_login_toc_agree'
                  {...formik.getFieldProps('acceptTerms')}
                />
                <label
                  className='form-check-label fw-bold text-gray-700 fs-6'
                  htmlFor='kt_login_toc_agree'
                >
                  I Agree the{' '}
                  <Link to='/' className='ms-1 link-primary'>
                    terms and conditions
                  </Link>
                  .
                </label>
                {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span style={{ color: 'black' }} role='alert'>{formik.errors.acceptTerms}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className='text-center'>
              <button
                type='submit'
                id='kt_sign_up_submit'
                className='btn btn-lg btn-primary w-100 mb-5'
                disabled={!formik.isValid || !formik.values.acceptTerms}
                onClick={handleClick}
              >
                {!loading && <span className='indicator-label'>Submit</span>}
                {loading && (
                  <span className='indicator-progress' style={{ display: 'block' }}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link to='/login'>
                <button
                  type='button'
                  id='kt_login_signup_form_cancel_button'
                  className='btn btn-lg btn-light-primary w-100 mb-5'
                >
                  Cancel
                </button>
              </Link>
            </div>
            {/* end::Form group */}
          </form>



        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
      {/* begin::Footer */}
      {/* <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-bold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact Us
          </a>
        </div>
      </div> */}
      {/* end::Footer */}
    </div>
  )
}