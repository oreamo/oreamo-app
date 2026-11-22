package com.oreamo.core.security;

import java.util.Optional;

import com.oreamo.user.UserRepository;
import com.oreamo.user.model.SessionUser;
import com.oreamo.user.model.User;
import com.oreamo.user.model.UserSearch;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserSearch userSearch = UserSearch.ofUsername(username);
        Optional<User> foundUser = userRepository.selectUser(userSearch);

        if (foundUser.isPresent()) {
            User user = foundUser.get();
            return SessionUser.ofUser(user);
        }

        log.error("Username {} not found", username);
        throw new UsernameNotFoundException("Username " + username + " not found");
    }
}
