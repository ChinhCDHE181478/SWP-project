package dev.chinhcd.backend.services.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.services.IJwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;
import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
public class JwtService implements IJwtService {

    @Value("${jwt.signerKey}")
    private String signerKey;

    @Value("${jwt.validTime}")
    private long accessExpire;


    @Override
    public String extractUserName(String token) {
        JWTClaimsSet claimsSet = extractAllClaims(token);
        return claimsSet.getSubject();
    }

    @Override
    public Date extractExpiredTime(String token) {
        JWTClaimsSet claimsSet = extractAllClaims(token);
        return claimsSet.getExpirationTime();
    }

    @Override
    public String generateAccessToken(User user) {
        return buildToken(user);
    }


    @Override
    public boolean isValidAcessToken(String token, User user) {
        String username = extractUserName(token);
        return user.getUsername().equals(username) && !isTokenExpired(token);
    }


    private boolean isTokenExpired(String token) {
        Date expirationTime = extractExpiredTime(token);
        return expirationTime.before(new Date());
    }

    private JWTClaimsSet extractAllClaims(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            if (!signedJWT.verify(new MACVerifier(signerKey.getBytes()))) {
                throw new RuntimeException("JWT signature verification failed");
            }
            return signedJWT.getJWTClaimsSet();
        } catch (ParseException | JOSEException exception) {
            throw new RuntimeException(exception);
        }
    }

    private String buildToken(User user) {
        var jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .issuer("caodoanhchinh")
                .subject(user.getUsername())
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plusSeconds(accessExpire).toEpochMilli()))
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        var jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException exception) {
            throw new RuntimeException(exception);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        stringJoiner.add(user.getRole().name());
        return stringJoiner.toString();
    }

}
