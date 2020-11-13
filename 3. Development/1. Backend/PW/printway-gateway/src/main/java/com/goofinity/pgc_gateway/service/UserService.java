package com.goofinity.pgc_gateway.service;

import com.goofinity.pgc_gateway.client.PgcServiceClient;
import com.goofinity.pgc_gateway.config.ApplicationProperties;
import com.goofinity.pgc_gateway.domain.User;
import com.goofinity.pgc_gateway.dto.UserSyncDTO;
import com.goofinity.pgc_gateway.enums.RoleEnum;
import com.goofinity.pgc_gateway.repository.UserRepository;
import com.goofinity.pgc_gateway.security.SecurityUtils;
import com.goofinity.pgc_gateway.security.error.DuplicateDataException;
import com.goofinity.pgc_gateway.security.error.InvalidDataException;
import com.goofinity.pgc_gateway.security.error.ObjectNotFoundException;
import com.goofinity.pgc_gateway.service.dto.UserDTO;
import io.github.jhipster.security.RandomUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

/**
 * Service class for managing users.
 */
@Service
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final ApplicationProperties properties;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final PgcServiceClient pgcServiceClient;

    public UserService(final ApplicationProperties properties,
                       final UserRepository userRepository,
                       final PasswordEncoder passwordEncoder,
                       final PgcServiceClient pgcServiceClient) {
        this.properties = properties;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.pgcServiceClient = pgcServiceClient;
    }

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                userRepository.save(user);
                log.debug("Activated user: {}", user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return userRepository.findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minusSeconds(86400)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                userRepository.save(user);
                return user;
            });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmailIgnoreCase(mail)
            .filter(User::isActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                userRepository.save(user);
                return user;
            });
    }

    public User registerUser(UserDTO userDTO, String password) {
        userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new DuplicateDataException("email");
            }
        });
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setEmail(userDTO.getEmail().toLowerCase());
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        newUser.setImageUrl(userDTO.getImageUrl());
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        newUser.setRoles(new HashSet<>(Collections.singletonList(RoleEnum.ROLE_SELLER.name())));
        userRepository.save(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    private boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.isActivated()) {
            return false;
        }
        userRepository.delete(existingUser);
        return true;
    }

    public User createUser(UserDTO userDTO) {
        if (StringUtils.isEmpty(userDTO.getPassword()) || userDTO.getPassword().length() < 6) {
            throw new InvalidDataException("password");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setDob(userDTO.getDob());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        user.setNote(userDTO.getNote());
        user.setFbLink(userDTO.getFbLink());
        user.setSellerLevel(userDTO.getSellerLevel());

        String encryptedPassword = passwordEncoder.encode(userDTO.getPassword());
        user.setPassword(encryptedPassword);
        user.setActivated(true);
        userDTO.getRoles().forEach(role -> {
            if (!RoleEnum.getByName(role).isPresent()) {
                throw new ObjectNotFoundException("role");
            }
        });
        if (userDTO.getRoles().size() != 1) {
            throw new InvalidDataException("only_one_role");
        }
        user.setRoles(userDTO.getRoles());
        syncUserToService(user);
        return user;
    }

    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByEmail)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                userRepository.save(user);
                log.debug("Changed password for User: {}", user);
            });
    }

    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneByEmail);
    }

    public void syncUserToService(User user) {
        pgcServiceClient.syncUserInfoToService(UserSyncDTO.builder()
                .activated(user.isActivated())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles())
                .address(user.getAddress())
                .phone(user.getPhone())
                .dob(user.getDob())
                .fbLink(user.getFbLink())
                .note(user.getNote())
                .sellerLevel(user.getSellerLevel())
                .orderHoldingHour(user.getOrderHoldingHour())
                .build(),
            properties.getSecurityKey());
        userRepository.save(user);
    }

    public void syncLockUserToService(User user) {
        pgcServiceClient.syncLockUserToService(UserSyncDTO.builder()
                .activated(user.isActivated())
                .email(user.getEmail())
                .build(),
            properties.getSecurityKey());
        userRepository.save(user);
    }
}
