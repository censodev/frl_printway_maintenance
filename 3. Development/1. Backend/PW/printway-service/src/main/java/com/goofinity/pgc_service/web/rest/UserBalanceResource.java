package com.goofinity.pgc_service.web.rest;

import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.domain.UserBalance;
import com.goofinity.pgc_service.enums.RoleEnum;
import com.goofinity.pgc_service.repository.UserBalanceRepository;
import com.goofinity.pgc_service.repository.UserRepository;
import com.goofinity.pgc_service.security.SecurityUtils;
import com.goofinity.pgc_service.security.error.ObjectNotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.goofinity.pgc_service.util.NumberUtil.addDouble;

@RestController
@RequestMapping("/api/user-balance")
public class UserBalanceResource {
    private static final Logger log = LoggerFactory.getLogger(UserBalanceResource.class);
    private final UserBalanceRepository userBalanceRepository;
    private final UserRepository userRepository;

    public UserBalanceResource(final UserBalanceRepository userBalanceRepository,
                               final UserRepository userRepository) {
        this.userBalanceRepository = userBalanceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<UserBalance> getUserBalance() {
        log.debug("Get user balance");
        return new ResponseEntity<>(userBalanceRepository.findByEmailIgnoreCase(SecurityUtils.getCurrentUserLogin()
            .orElseThrow(SecurityException::new))
            .orElseThrow(() -> new ObjectNotFoundException("user_balance")), HttpStatus.OK);
    }

    @GetMapping("/admin/overview")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<UserBalance> getOverviewBalance(@RequestParam Map<String, String> params) {
        log.debug("Get user balance");

        String sellerEmail = RoleEnum.ROLE_ADMIN.name();
        if (!StringUtils.isEmpty(params.get("sellerId"))) {
            sellerEmail = userRepository.findById(params.get("sellerId"))
                .orElse(User.builder().build()).getEmail();
        }
        UserBalance userBalance = userBalanceRepository.findByEmailIgnoreCase(sellerEmail)
            .orElseThrow(() -> new ObjectNotFoundException("user_balance"));
        return new ResponseEntity<>(userBalance, HttpStatus.OK);
    }

    @GetMapping("/admin/supplier/overview")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<UserBalance> getOverviewBalanceBySupplier(@RequestParam Map<String, String> params) {
        log.debug("Get supplier balance");
        if (StringUtils.isEmpty(params.get("supplierId"))) {
            List<String> emails = userRepository.findAllByActivatedTrueAndRolesContains(RoleEnum.ROLE_SUPPLIER_CONSTANT)
                .stream()
                .map(User::getEmail)
                .collect(Collectors.toList());

            List<UserBalance> userBalances = userBalanceRepository.findAllByEmailIn(emails);
            UserBalance overviewSupplierBalance = new UserBalance();

            for (UserBalance userBalance : userBalances) {
                overviewSupplierBalance.setAvailableAmount(addDouble(overviewSupplierBalance.getAvailableAmount(), userBalance.getAvailableAmount()));
                overviewSupplierBalance.setPaidAmount(addDouble(overviewSupplierBalance.getPaidAmount(), userBalance.getPaidAmount()));
                overviewSupplierBalance.setUpcomingAmount(addDouble(overviewSupplierBalance.getUpcomingAmount(), userBalance.getUpcomingAmount()));
            }

            return new ResponseEntity<>(overviewSupplierBalance, HttpStatus.OK);
        } else {
            String sellerEmail = userRepository.findById(params.get("supplierId"))
                .orElse(User.builder().build()).getEmail();
            UserBalance userBalance = userBalanceRepository.findByEmailIgnoreCase(sellerEmail)
                .orElseThrow(() -> new ObjectNotFoundException("user_balance"));
            return new ResponseEntity<>(userBalance, HttpStatus.OK);
        }
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyAuthority(\"" + RoleEnum.ROLE_ADMIN_CONSTANT + "\",\"" + RoleEnum.ROLE_ACCOUNTING_CONSTANT + "\",\"" + RoleEnum.ROLE_SUPPORTER_CONSTANT + "\",\"" + RoleEnum.ROLE_LISTING_CONSTANT + "\")")
    public ResponseEntity<Page<UserBalance>> getUserBalancesByPagination(@PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
                                                                         @RequestParam Map<String, String> params) {
        log.debug("Get user balances with pagination: {}", pageable);
        String keyword = StringUtils.isEmpty(params.get("keyword")) ? "" : params.get("keyword");
        return new ResponseEntity<>(userBalanceRepository.findAllByEmailContaining(keyword, pageable), HttpStatus.OK);
    }
}
