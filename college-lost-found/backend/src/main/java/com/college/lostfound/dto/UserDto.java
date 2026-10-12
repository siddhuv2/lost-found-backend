package com.college.lostfound.dto;

import com.college.lostfound.model.Role;
import com.college.lostfound.model.User;

public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String collegeId;
    private String department;
    private Role role;

    public UserDto() {}

    public UserDto(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.collegeId = user.getCollegeId();
        this.department = user.getDepartment();
        this.role = user.getRole();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCollegeId() { return collegeId; }
    public void setCollegeId(String collegeId) { this.collegeId = collegeId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
