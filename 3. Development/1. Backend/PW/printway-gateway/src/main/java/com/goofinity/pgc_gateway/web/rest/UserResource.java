package com.goofinity.pgc_gateway.web.rest;

import com.goofinity.pgc_gateway.domain.User;
import com.goofinity.pgc_gateway.dto.SellerLevelDTO;
import com.goofinity.pgc_gateway.dto.UserUpdateDTO;
import com.goofinity.pgc_gateway.enums.RoleEnum;
import com.goofinity.pgc_gateway.repository.UserRepository;
import com.goofinity.pgc_gateway.security.error.DuplicateDataException;
import com.goofinity.pgc_gateway.security.error.InvalidDataException;
import com.goofinity.pgc_gateway.security.error.ObjectNotFoundException;
import com.goofinity.pgc_gateway.service.MailService;
import com.goofinity.pgc_gateway.service.UserService;
import com.goofinity.pgc_gateway.service.dto.UserDTO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserResource {
    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    private final UserService userService;
    private final MailService mailService;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserResource(UserService userService, MailService mailService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.mailService = mailService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/user")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDTO userDTO) {
        log.debug("REST request to save User : {}", userDTO);

        if (userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
            throw new DuplicateDataException("email");
        }

        User newUser = userService.createUser(userDTO);
        mailService.sendCreationEmail(newUser);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @PutMapping("/user")
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public ResponseEntity<User> updateUser(@Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        log.debug("Update User : {}", userUpdateDTO);
        User existingUser = userRepository.findOneByEmailIgnoreCase(userUpdateDTO.getEmail())
            .orElseThrow(() -> new ObjectNotFoundException("user"));

        existingUser.setFirstName(userUpdateDTO.getFirstName());
        existingUser.setLastName(userUpdateDTO.getLastName());
        existingUser.setAddress(userUpdateDTO.getAddress());
        existingUser.setPhone(userUpdateDTO.getPhone());
        existingUser.setFbLink(userUpdateDTO.getFbLink());
        existingUser.setNote(userUpdateDTO.getNote());
        existingUser.setDob(userUpdateDTO.getDob());
        existingUser.setOrderHoldingHour(userUpdateDTO.getOrderHoldingHour());
        existingUser.setSellerLevel(userUpdateDTO.getSellerLevel() == null
            ? null
            : SellerLevelDTO.builder()
            .id(userUpdateDTO.getSellerLevel().getId())
            .build());
        if (!StringUtils.isEmpty(userUpdateDTO.getPassword())) {
            if (userUpdateDTO.getPassword().length() < 6) {
                throw new InvalidDataException("password_length");
            }

            existingUser.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
        }
        userService.syncUserToService(existingUser);
        mailService.sendUpdateUserEmail(existingUser);

        return new ResponseEntity<>(existingUser, HttpStatus.OK);
    }

    @PutMapping("/user/lock")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
    public void lockUser(@RequestParam String email,
                         @RequestParam boolean activated) {
        log.debug("Lock/unlock user : {} with value: {}", email, activated);

        User existingUser = userRepository.findOneByEmailIgnoreCase(email)
            .orElseThrow(() -> new ObjectNotFoundException("user"));
        existingUser.setActivated(activated);
        userService.syncLockUserToService(existingUser);
        mailService.sendLockEmail(existingUser);
    }

//    @GetMapping("/users/authorities")
//    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
//    public List<String> getAuthorities() {
//        return userService.getAuthorities();
//    }

//    @GetMapping("/users/{login:" + Constants.LOGIN_REGEX + "}")
//    public ResponseEntity<User> getUser(@PathVariable String login) {
//        log.debug("REST request to get User : {}", login);
//        return new ResponseEntity<>(userRepository.findOneByEmailIgnoreCase(login)
//            .orElseThrow(() -> new ObjectNotFoundException("user")), HttpStatus.OK);
//    }


//    @DeleteMapping("/users/{login:" + Constants.LOGIN_REGEX + "}")
//    @PreAuthorize("hasAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\")")
//    public ResponseEntity<Void> deleteUser(@PathVariable String login) {
//        log.debug("REST request to delete User: {}", login);
//        userService.deleteUser(login);
//        return ResponseEntity.noContent().headers(HeaderUtil.createAlert(applicationName, "A user is deleted with identifier " + login, login)).build();
//    }
}
