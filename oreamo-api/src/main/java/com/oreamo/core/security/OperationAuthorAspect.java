package com.oreamo.core.security;

import java.util.Optional;

import com.oreamo.common.model.OperationAuthor;
import com.oreamo.user.model.SessionUser;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class OperationAuthorAspect {

    private static final String AUTHENTICATION_FAILURE_MESSAGE =
            "[OperationAuthorAspect] Author injection failed because user is not authenticated.";

    @Before("execution(* com.oreamo..*Controller.*(..)) && args(operationAuthor)")
    public void injectAuthor(OperationAuthor operationAuthor) {
        String username = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getPrincipal)
                .map(SessionUser.class::cast)
                .orElseThrow(() -> new IllegalArgumentException(AUTHENTICATION_FAILURE_MESSAGE))
                .getUsername();
        operationAuthor.setAuthor(username);
    }
}
