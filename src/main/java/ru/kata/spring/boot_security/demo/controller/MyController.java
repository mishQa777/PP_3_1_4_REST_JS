package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.Set;

@Controller
public class MyController {

    private final UserService userService;

    public MyController(UserService userService) {
        this.userService = userService;
    }

    // для юзера
    @GetMapping("/user")
    public String pageForUser(Model model, Principal principal) {
        model.addAttribute("user", userService.loadUserByUsername(principal.getName()));
        return "/user";
    }
    // для админа
    @GetMapping("/admin")
    public String userList(Model model) {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        model.addAttribute("allUsers", userService.getAllUsers());
        model.addAttribute("roles", userService.getAllRoles());
        model.addAttribute("userMain", user);
        return "/admin";
    }

    @PostMapping("admin/new")
    public String addUser(User user, @RequestParam("listRoles") Set<Role> roles) {
        userService.saveOrUpdate(user, roles);
        return "redirect:/admin";
    }


    @PostMapping("admin/edit")
    public String update(@ModelAttribute("user") User user, @RequestParam("listRoles") Set<Role> roles) {
        userService.saveOrUpdate(user, roles);
        return "redirect:/admin";
    }

    @DeleteMapping("admin/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }
}