-- Insert job categories
INSERT INTO job_categories (name, description) VALUES
('Technology', 'Software development, IT, and tech-related positions'),
('Marketing', 'Digital marketing, content creation, and advertising roles'),
('Finance', 'Accounting, financial analysis, and banking positions'),
('Healthcare', 'Medical, nursing, and healthcare administration roles'),
('Education', 'Teaching, training, and educational administration'),
('Sales', 'Sales representatives, account managers, and business development'),
('Human Resources', 'HR management, recruitment, and employee relations'),
('Design', 'Graphic design, UX/UI, and creative positions'),
('Operations', 'Operations management, logistics, and supply chain'),
('Customer Service', 'Customer support and service representative roles');

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@jobportal.com', '$2b$10$rOzJqKqVQQGVqKqVQQGVqeKqVQQGVqKqVQQGVqKqVQQGVqKqVQQGVq', 'Admin', 'User', 'admin');

-- Insert sample employers (password: password123)
INSERT INTO users (email, password, first_name, last_name, role, company_name, company_description, location, phone) VALUES
('employer1@company.com', '$2b$10$rOzJqKqVQQGVqKqVQQGVqeKqVQQGVqKqVQQGVqKqVQQGVqKqVQQGVq', 'John', 'Smith', 'employer', 'TechCorp Inc', 'Leading technology solutions provider', 'San Francisco, CA', '+1-555-0101'),
('employer2@startup.com', '$2b$10$rOzJqKqVQQGVqKqVQQGVqeKqVQQGVqKqVQQGVqKqVQQGVqKqVQQGVq', 'Sarah', 'Johnson', 'employer', 'StartupXYZ', 'Innovative startup in fintech space', 'New York, NY', '+1-555-0102');

-- Insert sample job seekers (password: password123)
INSERT INTO users (email, password, first_name, last_name, role, location, phone) VALUES
('jobseeker1@email.com', '$2b$10$rOzJqKqVQQGVqKqVQQGVqeKqVQQGVqKqVQQGVqKqVQQGVqKqVQQGVq', 'Mike', 'Davis', 'job_seeker', 'Los Angeles, CA', '+1-555-0201'),
('jobseeker2@email.com', '$2b$10$rOzJqKqVQQGVqKqVQQGVqeKqVQQGVqKqVQQGVqKqVQQGVqKqVQQGVq', 'Emily', 'Wilson', 'job_seeker', 'Chicago, IL', '+1-555-0202');

-- Insert sample jobs
INSERT INTO jobs (title, description, requirements, salary_min, salary_max, location, job_type, category_id, employer_id) VALUES
('Senior Software Engineer', 'We are looking for a senior software engineer to join our team. You will be responsible for developing scalable web applications and mentoring junior developers.', 'Bachelor''s degree in Computer Science, 5+ years of experience with React and Node.js, Strong problem-solving skills', 90000, 130000, 'San Francisco, CA', 'full-time', 1, 2),
('Marketing Manager', 'Lead our marketing efforts and develop comprehensive marketing strategies to increase brand awareness and drive customer acquisition.', 'Bachelor''s degree in Marketing or related field, 3+ years of marketing experience, Experience with digital marketing tools', 60000, 85000, 'New York, NY', 'full-time', 2, 3),
('Frontend Developer', 'Join our development team to create amazing user experiences. You will work with modern frontend technologies and collaborate with designers.', 'Proficiency in React, JavaScript, HTML/CSS, Experience with responsive design, Portfolio of previous work', 70000, 95000, 'San Francisco, CA', 'full-time', 1, 2),
('Data Analyst', 'Analyze business data to provide insights and support decision-making processes. Work with large datasets and create meaningful reports.', 'Bachelor''s degree in Statistics or related field, Proficiency in SQL and Python, Experience with data visualization tools', 55000, 75000, 'New York, NY', 'full-time', 1, 3),
('UX Designer', 'Design intuitive and user-friendly interfaces for our web and mobile applications. Collaborate with product and engineering teams.', 'Bachelor''s degree in Design or related field, Proficiency in Figma/Sketch, Strong portfolio demonstrating UX process', 65000, 90000, 'San Francisco, CA', 'full-time', 8, 2);

-- Insert sample job applications
INSERT INTO job_applications (job_id, job_seeker_id, cover_letter, status) VALUES
(1, 4, 'I am very interested in this senior software engineer position. With my 6 years of experience in full-stack development, I believe I would be a great fit for your team.', 'pending'),
(2, 5, 'I am excited about the marketing manager opportunity. My background in digital marketing and proven track record of successful campaigns make me an ideal candidate.', 'reviewed'),
(3, 4, 'As a passionate frontend developer, I am thrilled about the opportunity to work with your team on creating exceptional user experiences.', 'pending');
