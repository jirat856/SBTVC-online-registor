
        // Simple page navigation simulation
        document.querySelectorAll('a[href^="#program"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const programId = this.getAttribute('href').substring(1);
                alert(`กำลังนำท่านไปยังหน้าสมัครเรียนสาขา ${this.querySelector('h3').textContent}`);
                // In a real application, this would navigate to the program's registration page
                // window.location.href = `/register/${programId}`;
            });
        });


        // Modal functionality
        const loginButton = document.getElementById('login-button');
        const registerButton = document.getElementById('register-button');
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        const closeModalButtons = document.querySelectorAll('.close-modal');
        const authButtons = document.getElementById('auth-buttons');
        const profileBox = document.getElementById('profile-box');
        const courseSelection = document.getElementById('course-selection');
        const homeRegisterButton = document.getElementById('home-register-button');
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');
        const totalUsersElement = document.getElementById('total-users');
        const recentUserElement = document.getElementById('recent-user');

        loginButton.addEventListener('click', () => {
            loginModal.classList.add('active');
        });

        registerButton.addEventListener('click', () => {
            registerModal.classList.add('active');
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                loginModal.classList.remove('active');
                registerModal.classList.remove('active');
            });
        });

        const openModalBtn = document.getElementById('openModalBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modal = document.getElementById('myModal');

        openModalBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        });

        closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        });

        modal.addEventListener('click', (e) => {
        // เช็กว่าคลิกตรงพื้นหลัง (modal เอง) ไม่ใช่กล่องด้านใน
        if (e.target === modal) {
        modal.classList.add('hidden');
        }
        });
        
        // Get elements for login and register modals
        const homeLoginButton = document.getElementById('home-login-button');       
        
        // Close modals function
        function closeModals() {
            loginModal.classList.remove('active');
            registerModal.classList.remove('active');
            loginModal.style.visibility = 'hidden';
            loginModal.style.opacity = '0';
            registerModal.style.visibility = 'hidden';
            registerModal.style.opacity = '0';
        }

        // User state
        let currentUser = null;

        // Check if user is logged in from localStorage
        function checkLoggedInUser() {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateUIForLoggedInUser();
            }
        }

        // Update UI for logged in user
        function updateUIForLoggedInUser() {
            if (currentUser) {
                // Update profile box
                document.getElementById('profile-name').textContent = `${currentUser.firstname} ${currentUser.lastname}`;
                document.getElementById('profile-email').textContent = currentUser.email;
                document.getElementById('profile-phone').textContent = currentUser.phone || 'ไม่ระบุ';
                document.getElementById('profile-initials').textContent = currentUser.firstname.charAt(0);
                
                // Show profile box, hide auth buttons
                authButtons.classList.add('hidden');
                profileBox.classList.add('active');
                
                // Show course selection
                courseSelection.classList.remove('hidden');
            } else {
                // Hide profile box, show auth buttons
                authButtons.classList.remove('hidden');
                profileBox.classList.remove('active');
                
                // Hide course selection
                courseSelection.classList.add('hidden');
            }
        }

        // Toggle profile box
        function toggleProfileBox() {
            profileBox.classList.toggle('active');
        }

        // Logout function
        function logout() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUIForLoggedInUser();
            
            Swal.fire({
                icon: 'success',
                title: 'ออกจากระบบสำเร็จ',
                text: 'ขอบคุณที่ใช้บริการ',
                confirmButtonColor: '#4776E6'
            });
        }

        // Switch between modals
        document.getElementById('switch-to-register').addEventListener('click', () => {
            loginModal.classList.remove('active');
            registerModal.classList.add('active');
        });

        document.getElementById('switch-to-login').addEventListener('click', () => {
            registerModal.classList.remove('active');
            loginModal.classList.add('active');
        });

        // Open login modal
        function openLoginModal() {
            registerModal.classList.remove('active');
            loginModal.classList.add('active');
            loginModal.style.visibility = 'visible';
            loginModal.style.opacity = '1';
        }

        // Open register modal
        function openRegisterModal() {
            loginModal.classList.remove('active');
            registerModal.classList.add('active');
            registerModal.style.visibility = 'visible';
            registerModal.style.opacity = '1';
        }
        
        // Event listeners for opening modals
        loginButton.addEventListener('click', openLoginModal);
        registerButton.addEventListener('click', openRegisterModal);
        homeLoginButton.addEventListener('click', openLoginModal);
        homeRegisterButton.addEventListener('click', openRegisterModal);
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            openRegisterModal();
        });
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            openLoginModal();
        });

        // Event listeners for closing modals
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModals);
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal || e.target === registerModal) {
                closeModals();
            }
        });

        // Function to submit data to Google Sheets via JSONP
        function submitToGoogleSheets(formData, action) {
            // Show loading state
            Swal.fire({
                title: 'กำลังดำเนินการ...',
                text: 'โปรดรอสักครู่',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Create URL with parameters
            const url = 'https://script.google.com/macros/s/AKfycbwVJAqYYRLvPFsiZJ96DMCnYJ0v-_o2QyKY3-xKSLkANqbuJFukuSUTNQElXHSed6rFSQ/exec';
            const params = new URLSearchParams();
            
            // Add form data to params
            for (const key in formData) {
                params.append(key, formData[key]);
            }
            
            // Add action parameter
            params.append('action', action);
            
            // Create script element for JSONP
            const script = document.createElement('script');
            const callbackName = 'jsonpCallback_' + Math.round(Math.random() * 1000000);
            
            // Define callback function
            window[callbackName] = function(response) {
                // Remove script element
                document.body.removeChild(script);
                
                // Handle response
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ!',
                        text: response.message || 'ดำเนินการเรียบร้อยแล้ว',
                        confirmButtonColor: '#4776E6'
                    });
                    
                    // Close modals
                    closeModals();
                    
                    // If login or register was successful, save user data
                    if (response.user) {
                        currentUser = response.user;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        updateUIForLoggedInUser();
                    }
                    
                    // Update user stats
                    fetchUserStats();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: response.message || 'เกิดข้อผิดพลาดในการดำเนินการ',
                        confirmButtonColor: '#4776E6'
                    });
                }
                
                // Clean up callback
                delete window[callbackName];
            };
            
            // Set up script for JSONP
            script.src = `${url}?${params.toString()}&callback=${callbackName}`;
            document.body.appendChild(script);
            
            // Handle timeout
            setTimeout(() => {
                if (window[callbackName]) {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: 'การเชื่อมต่อล้มเหลว โปรดลองอีกครั้งในภายหลัง',
                        confirmButtonColor: '#4776E6'
                    });
                    
                    document.body.removeChild(script);
                    delete window[callbackName];
                }
            }, 10000); // 10 seconds timeout
        }

        // Function to fetch user statistics
        function fetchUserStats() {
            const url = 'https://script.google.com/macros/s/AKfycbwVJAqYYRLvPFsiZJ96DMCnYJ0v-_o2QyKY3-xKSLkANqbuJFukuSUTNQElXHSed6rFSQ/exec';
            const callbackName = 'statsCallback_' + Math.round(Math.random() * 1000000);
            
            // Define callback function
            window[callbackName] = function(response) {
                // Remove script element
                document.body.removeChild(script);
                
                // Update stats on page
                if (response.success) {
                    totalUsersElement.textContent = response.totalUsers || '0';
                    recentUserElement.textContent = response.recentUser || 'ไม่มีข้อมูล';
                } else {
                    totalUsersElement.textContent = 'ไม่สามารถโหลดข้อมูลได้';
                    recentUserElement.textContent = 'ไม่สามารถโหลดข้อมูลได้';
                }
                
                // Clean up callback
                delete window[callbackName];
            };
            
            // Set up script for JSONP
            const script = document.createElement('script');
            script.src = `${url}?action=getStats&callback=${callbackName}`;
            document.body.appendChild(script);
            
            // Handle timeout
            setTimeout(() => {
                if (window[callbackName]) {
                    totalUsersElement.textContent = 'ไม่สามารถโหลดข้อมูลได้';
                    recentUserElement.textContent = 'ไม่สามารถโหลดข้อมูลได้';
                    
                    if (document.body.contains(script)) {
                        document.body.removeChild(script);
                    }
                    delete window[callbackName];
                }
            }, 10000); // 10 seconds timeout
        }

        // Form submission handling
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                remember: document.getElementById('remember').checked
            };
            
            submitToGoogleSheets(formData, 'login');
        });

        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if passwords match
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'รหัสผ่านไม่ตรงกัน',
                    text: 'กรุณาตรวจสอบรหัสผ่านของคุณอีกครั้ง',
                    confirmButtonColor: '#4776E6'
                });
                return;
            }
            
            const formData = {
                firstname: document.getElementById('firstname').value,
                lastname: document.getElementById('lastname').value,
                email: document.getElementById('reg-email').value,
                phone: document.getElementById('phone').value,
                password: password,
                terms: document.getElementById('terms').checked
            };
            
            submitToGoogleSheets(formData, 'register');
        });

        // Check for logged in user on page load
        document.addEventListener('DOMContentLoaded', () => {
            checkLoggedInUser();
            fetchUserStats();
        });
    
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'960770c17266271d',t:'MTc1MjczMTIwMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();